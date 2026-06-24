import express from 'express';
import { z } from 'zod';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/error.js';

const router = express.Router();

const updateProfileSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  phone: z.string().max(30).optional(),
  avatar: z
    .object({ url: z.string(), public_id: z.string().optional() })
    .optional(),
});

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(5),
  line1: z.string().min(3),
  line2: z.string().optional().default(''),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(2),
  country: z.string().min(2),
  isDefault: z.boolean().optional().default(false),
});

// GET /api/users/me
router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name slug price images ratings numReviews')
      .lean();
    res.json({ success: true, data: user });
  })
);

// PATCH /api/users/me
router.patch(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(422, 'Invalid input', parsed.error.issues);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: user });
  })
);

// POST /api/users/me/addresses
router.post(
  '/me/addresses',
  protect,
  asyncHandler(async (req, res) => {
    const parsed = addressSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(422, 'Invalid input', parsed.error.issues);

    const user = await User.findById(req.user._id);
    if (parsed.data.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }
    user.addresses.push(parsed.data);
    await user.save();
    res.status(201).json({ success: true, data: user });
  })
);

// PATCH /api/users/me/addresses/:index
router.patch(
  '/me/addresses/:index',
  protect,
  asyncHandler(async (req, res) => {
    const idx = Number(req.params.index);
    const user = await User.findById(req.user._id);
    if (!Number.isInteger(idx) || idx < 0 || idx >= user.addresses.length) {
      throw new ApiError(404, 'Address not found');
    }
    if (req.body.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }
    Object.assign(user.addresses[idx], req.body);
    await user.save();
    res.json({ success: true, data: user });
  })
);

// DELETE /api/users/me/addresses/:index
router.delete(
  '/me/addresses/:index',
  protect,
  asyncHandler(async (req, res) => {
    const idx = Number(req.params.index);
    const user = await User.findById(req.user._id);
    if (!Number.isInteger(idx) || idx < 0 || idx >= user.addresses.length) {
      throw new ApiError(404, 'Address not found');
    }
    user.addresses.splice(idx, 1);
    await user.save();
    res.json({ success: true, data: user });
  })
);

// ============= Wishlist =============
// GET /api/users/me/wishlist
router.get(
  '/me/wishlist',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name slug price images ratings numReviews stock')
      .lean();
    res.json({ success: true, data: user.wishlist });
  })
);

// POST /api/users/me/wishlist  { productId }
router.post(
  '/me/wishlist',
  protect,
  asyncHandler(async (req, res) => {
    const { productId } = req.body;
    if (!productId) throw new ApiError(422, 'productId is required.');
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, 'Product not found');

    const user = await User.findById(req.user._id);
    const exists = user.wishlist.find((id) => id.toString() === productId);
    if (!exists) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.status(201).json({ success: true, data: user.wishlist });
  })
);

// DELETE /api/users/me/wishlist/:productId
router.delete(
  '/me/wishlist/:productId',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();
    res.json({ success: true, data: user.wishlist });
  })
);

// ===================== ADMIN ENDPOINTS =====================

// GET /api/users/admin/all — list all users (admin only)
router.get(
  '/admin/all',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: items,
    });
  })
);

// PATCH /api/users/admin/:id/role — change a user's role (admin only)
router.patch(
  '/admin/:id/role',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      throw new ApiError(422, 'Invalid role');
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ success: true, data: user });
  })
);

// PATCH /api/users/admin/:id/status — activate/deactivate a user (admin only)
router.patch(
  '/admin/:id/status',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { active } = req.body;
    if (typeof active !== 'boolean') {
      throw new ApiError(422, 'active must be a boolean');
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active },
      { new: true }
    );
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ success: true, data: user });
  })
);

// GET /api/users/admin/:id/orders — get a specific user's orders (admin only)
router.get(
  '/admin/:id/orders',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: orders });
  })
);

export default router;
