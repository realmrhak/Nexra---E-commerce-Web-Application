import express from 'express';
import HomeSlide from '../models/HomeSlide.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/error.js';

const router = express.Router();

/**
 * Public: list active slides (with product populated) for the home page slider.
 * Ordered by `order` then `createdAt`.
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const slides = await HomeSlide.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .populate({
        path: 'product',
        select: 'name slug price oldPrice images ratings numReviews stock brand isActive',
        match: { isActive: true },
      })
      .lean();

    // Filter out slides whose product was deleted or deactivated
    const valid = slides.filter((s) => s.product);

    res.json({ success: true, data: valid });
  })
);

/**
 * Admin: list ALL slides (including inactive + ones with deleted products)
 */
router.get(
  '/all',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const slides = await HomeSlide.find()
      .sort({ order: 1, createdAt: 1 })
      .populate('product', 'name slug price oldPrice images stock isActive')
      .lean();
    res.json({ success: true, data: slides });
  })
);

/**
 * Admin: create a new slide
 * Body: { product: productId, badge?, customTitle?, order?, isActive? }
 */
router.post(
  '/',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { product } = req.body;
    if (!product) throw new ApiError(422, 'product (productId) is required.');

    // Verify the product exists
    const prod = await Product.findById(product).lean();
    if (!prod) throw new ApiError(404, 'Product not found.');

    // If no order given, put it at the end
    if (req.body.order === undefined) {
      const count = await HomeSlide.countDocuments();
      req.body.order = count;
    }

    const slide = await HomeSlide.create(req.body);
    await slide.populate('product', 'name slug price oldPrice images stock');
    res.status(201).json({ success: true, data: slide });
  })
);

/**
 * Admin: update a slide (change product, badge, order, etc.)
 */
router.put(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    // If changing product, verify it exists
    if (req.body.product) {
      const prod = await Product.findById(req.body.product).lean();
      if (!prod) throw new ApiError(404, 'Product not found.');
    }

    const slide = await HomeSlide.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('product', 'name slug price oldPrice images stock');

    if (!slide) throw new ApiError(404, 'Slide not found.');
    res.json({ success: true, data: slide });
  })
);

/**
 * Admin: delete a slide
 */
router.delete(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const slide = await HomeSlide.findByIdAndDelete(req.params.id);
    if (!slide) throw new ApiError(404, 'Slide not found.');
    res.json({ success: true, message: 'Slide deleted.' });
  })
);

/**
 * Admin: reorder slides
 * Body: { orders: [{ id, order }, ...] }
 */
router.patch(
  '/reorder',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { orders } = req.body;
    if (!Array.isArray(orders)) throw new ApiError(422, 'orders must be an array.');

    await Promise.all(
      orders.map(({ id, order }) =>
        HomeSlide.findByIdAndUpdate(id, { order: Number(order) || 0 })
      )
    );
    res.json({ success: true, message: 'Slides reordered.' });
  })
);

export default router;
