import express from 'express';
import { z } from 'zod';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/error.js';

const router = express.Router();

const itemSchema = z.object({
  productId: z.string().min(10),
  quantity: z.number().int().min(1).max(99).optional().default(1),
  size: z.string().optional().default(''),
  color: z.string().optional().default(''),
});

// GET /api/cart
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json({ success: true, data: cart });
  })
);

// POST /api/cart  — add item
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const parsed = itemSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(422, 'Invalid input', parsed.error.issues);
    const { productId, quantity, size, color } = parsed.data;

    const product = await Product.findById(productId).lean();
    if (!product) throw new ApiError(404, 'Product not found');
    if (product.stock < quantity) throw new ApiError(400, 'Not enough stock available.');

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    // existing?
    const existing = cart.items.find(
      (it) =>
        it.product.toString() === productId &&
        (it.size || '') === (size || '') &&
        (it.color || '') === (color || '')
    );

    if (existing) {
      existing.quantity = Math.min(99, existing.quantity + quantity);
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.images?.[0]?.url || '',
        price: product.price,
        size,
        color,
        quantity,
      });
    }

    await cart.save();
    res.status(201).json({ success: true, data: cart });
  })
);

// PATCH /api/cart/:itemId — update qty
router.patch(
  '/:itemId',
  protect,
  asyncHandler(async (req, res) => {
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new ApiError(422, 'Quantity must be a positive integer.');
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new ApiError(404, 'Cart not found');

    const item = cart.items.id(req.params.itemId);
    if (!item) throw new ApiError(404, 'Cart item not found');

    item.quantity = Math.min(99, quantity);
    await cart.save();
    res.json({ success: true, data: cart });
  })
);

// DELETE /api/cart/:itemId
router.delete(
  '/:itemId',
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new ApiError(404, 'Cart not found');

    const item = cart.items.id(req.params.itemId);
    if (!item) throw new ApiError(404, 'Cart item not found');

    cart.items.pull(req.params.itemId);
    await cart.save();
    res.json({ success: true, data: cart });
  })
);

// DELETE /api/cart — clear
router.delete(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], couponCode: '', discount: 0 } }
    );
    res.json({ success: true, message: 'Cart cleared.' });
  })
);

export default router;
