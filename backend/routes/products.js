import express from 'express';
import { z } from 'zod';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/error.js';
import { upload, uploadToCloudinary } from '../config/cloudinary.js';
import { uploadLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// ---------- Query parser ----------
const parseListQuery = (q) => {
  const page = Math.max(1, parseInt(q.page, 10) || 1);
  const limit = Math.min(60, Math.max(1, parseInt(q.limit, 10) || 12));
  const skip = (page - 1) * limit;

  const filter = { isActive: true };

  if (q.category) {
    // match either ObjectId, slug, or name
    filter.$or = [
      { category: q.category.match(/^[0-9a-fA-F]{24}$/) ? q.category : null },
    ].filter(Boolean);
  }
  if (q.slug) {
    // If slug given, ignore other filters — handled separately below
  }
  if (q.brand) {
    filter.brand = { $regex: q.brand, $options: 'i' };
  }
  if (q.search) {
    filter.$text = { $search: q.search };
  }
  if (q.minPrice || q.maxPrice) {
    filter.price = {};
    if (q.minPrice) filter.price.$gte = Number(q.minPrice);
    if (q.maxPrice) filter.price.$lte = Number(q.maxPrice);
  }
  if (q.isFeatured === 'true') filter.isFeatured = true;
  if (q.isNew === 'true') filter.isNew = true;
  if (q.inStock === 'true') filter.stock = { $gt: 0 };

  const sortMap = {
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'rating-desc': { ratings: -1 },
    popular: { sold: -1 },
  };
  const sort = sortMap[q.sort] || sortMap.newest;

  return { page, limit, skip, filter, sort };
};

// ---------- Public: list products ----------
// GET /api/products
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page, limit, skip, filter, sort } = parseListQuery(req.query);

    // Category by slug support
    if (req.query.categorySlug) {
      const cat = await Category.findOne({ slug: req.query.categorySlug }).lean();
      if (cat) filter.category = cat._id;
    }

    // Admin-only: when ?includeInactive=true AND the requester is an admin,
    // show inactive products too. Otherwise force isActive: true.
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    let isAdmin = false;
    if (token && token !== '') {
      try {
        const { verifyToken } = await import('../utils/jwt.js');
        const decoded = verifyToken(token);
        const { default: User } = await import('../models/User.js');
        const u = await User.findById(decoded.id).lean();
        isAdmin = u?.role === 'admin';
      } catch {
        // ignore — treat as non-admin
      }
    }
    if (!(req.query.includeInactive === 'true' && isAdmin)) {
      filter.isActive = true;
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      count: items.length,
      data: items,
    });
  })
);

// ---------- Public: featured + new arrivals ----------
router.get(
  '/featured',
  asyncHandler(async (req, res) => {
    const limit = Math.min(20, parseInt(req.query.limit, 10) || 8);
    const items = await Product.find({ isActive: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json({ success: true, data: items });
  })
);

router.get(
  '/new-arrivals',
  asyncHandler(async (req, res) => {
    const limit = Math.min(20, parseInt(req.query.limit, 10) || 8);
    const items = await Product.find({ isActive: true, isNew: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json({ success: true, data: items });
  })
);

// ---------- Public: related products ----------
router.get(
  '/:id/related',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).lean();
    if (!product) throw new ApiError(404, 'Product not found');

    const items = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    })
      .limit(4)
      .lean();
    res.json({ success: true, data: items });
  })
);

// ---------- Public: get by slug ----------
router.get(
  '/slug/:slug',
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug')
      .lean();
    if (!product) throw new ApiError(404, 'Product not found');
    res.json({ success: true, data: product });
  })
);

// ---------- Public: get by id ----------
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .lean();
    if (!product) throw new ApiError(404, 'Product not found');
    res.json({ success: true, data: product });
  })
);

// ---------- Admin: create ----------
const productCreateSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(5000).optional().default(''),
  brand: z.string().max(100).optional().default('Generic'),
  category: z.string().optional().nullable(),
  price: z.number().min(0),
  oldPrice: z.number().min(0).optional().nullable(),
  currency: z.string().max(3).optional().default('USD'),
  images: z
    .array(z.object({ url: z.string(), public_id: z.string().optional() }))
    .optional()
    .default([]),
  sizes: z.array(z.string()).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  stock: z.number().min(0).optional().default(0),
  isFeatured: z.boolean().optional().default(false),
  isNew: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

router.post(
  '/',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const parsed = productCreateSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(422, 'Validation failed', parsed.error.issues);
    const product = await Product.create(parsed.data);
    res.status(201).json({ success: true, data: product });
  })
);

// ---------- Admin: update ----------
router.put(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!product) throw new ApiError(404, 'Product not found');
    res.json({ success: true, data: product });
  })
);

// ---------- Admin: delete ----------
router.delete(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new ApiError(404, 'Product not found');
    res.json({ success: true, message: 'Product deleted.' });
  })
);

// ---------- Admin: add image to existing product ----------
// POST /api/products/:id/images  (multipart/form-data, field "image")
router.post(
  '/:id/images',
  protect,
  adminOnly,
  uploadLimiter,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, 'Product not found');
    if (!req.file) throw new ApiError(400, 'No image uploaded.');

    const result = await uploadToCloudinary(req.file.buffer, 'products');
    product.images.push({ url: result.url, public_id: result.public_id });
    await product.save();
    res.status(201).json({ success: true, data: product });
  })
);

// ---------- Admin: remove a specific image from a product ----------
// DELETE /api/products/:id/images/:publicId
router.delete(
  '/:id/images/:publicId',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, 'Product not found');

    const publicId = decodeURIComponent(req.params.publicId);
    const idx = product.images.findIndex((img) => img.public_id === publicId);
    if (idx === -1) throw new ApiError(404, 'Image not found on this product');

    // Optionally delete from Cloudinary too
    try {
      const { deleteFromCloudinary } = await import('../config/cloudinary.js');
      await deleteFromCloudinary(publicId);
    } catch (err) {
      console.warn('Cloudinary delete failed:', err.message);
    }

    product.images.splice(idx, 1);
    await product.save();
    res.json({ success: true, data: product });
  })
);

// ---------- Admin: image upload ----------
// POST /api/products/upload-image
router.post(
  '/upload-image',
  protect,
  adminOnly,
  uploadLimiter,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'No image uploaded.');
    const result = await uploadToCloudinary(req.file.buffer, 'products');
    res.status(201).json({ success: true, data: result });
  })
);

export default router;
