import express from 'express';
import { z } from 'zod';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/error.js';

const router = express.Router({ mergeParams: true });

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional().default(''),
});

// POST /api/products/:id/reviews
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(422, 'Invalid input', parsed.error.issues);

    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, 'Product not found');

    // Has the user already reviewed?
    const already = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (already) throw new ApiError(409, 'You have already reviewed this product.');

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    });

    product.recalcRatings();
    await product.save();

    res.status(201).json({ success: true, data: product });
  })
);

// GET /api/products/:id/reviews
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
      .select('reviews ratings numReviews')
      .lean();
    if (!product) throw new ApiError(404, 'Product not found');
    res.json({ success: true, data: product.reviews });
  })
);

// DELETE /api/products/:id/reviews/:reviewId
router.delete(
  '/:reviewId',
  protect,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, 'Product not found');

    const review = product.reviews.id(req.params.reviewId);
    if (!review) throw new ApiError(404, 'Review not found');

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      throw new ApiError(403, 'Not authorized to delete this review.');
    }

    review.deleteOne();
    product.recalcRatings();
    await product.save();
    res.json({ success: true, message: 'Review removed.' });
  })
);

export default router;
