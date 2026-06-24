import express from 'express';
import { z } from 'zod';
import Category from '../models/Category.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/error.js';

const router = express.Router();

const createSchema = z.object({
  name: z.string().min(2).max(60),
  icon: z.string().optional().default(''),
  image: z.object({ url: z.string(), public_id: z.string().optional() }).optional(),
  parent: z.string().optional().nullable(),
  order: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

// GET /api/categories
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const items = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .populate('parent', 'name slug')
      .lean();
    res.json({ success: true, data: items });
  })
);

// GET /api/categories/:slug
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const cat = await Category.findOne({ slug: req.params.slug }).lean();
    if (!cat) throw new ApiError(404, 'Category not found');
    res.json({ success: true, data: cat });
  })
);

// POST /api/categories
router.post(
  '/',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(422, 'Validation failed', parsed.error.issues);
    const cat = await Category.create(parsed.data);
    res.status(201).json({ success: true, data: cat });
  })
);

// PUT /api/categories/:id
router.put(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const cat = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!cat) throw new ApiError(404, 'Category not found');
    res.json({ success: true, data: cat });
  })
);

// DELETE /api/categories/:id
router.delete(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) throw new ApiError(404, 'Category not found');
    res.json({ success: true, message: 'Category deleted.' });
  })
);

export default router;
