import express from 'express';
import { z } from 'zod';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/error.js';

const router = express.Router();

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string(),
        name: z.string(),
        image: z.string().optional().default(''),
        price: z.number().min(0),
        size: z.string().optional().default(''),
        color: z.string().optional().default(''),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, 'At least one item is required'),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(5),
    line1: z.string().min(3),
    line2: z.string().optional().default(''),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(2),
    country: z.string().min(2),
  }),
  shippingMethod: z.string().optional().default('standard'),
  shippingCost: z.number().min(0).optional().default(0),
  tax: z.number().min(0).optional().default(0),
  paymentMethod: z.enum(['cod', 'card', 'paypal']).optional().default('cod'),
  couponCode: z.string().optional().default(''),
  notes: z.string().max(500).optional().default(''),
});

// GET /api/orders — current user's orders
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ user: req.user._id }),
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

// GET /api/orders/:id
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).lean();
    if (!order) throw new ApiError(404, 'Order not found');

    // Only the owner or admin may view
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new ApiError(403, 'Forbidden.');
    }
    res.json({ success: true, data: order });
  })
);

// POST /api/orders
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(422, 'Validation failed', parsed.error.issues);

    const { items, shippingAddress, shippingMethod, shippingCost, tax,
      paymentMethod, couponCode, notes } = parsed.data;

    // Validate stock + lock product prices from DB (security: never trust client prices)
    const productIds = items.map((it) => it.product);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const safeItems = items.map((it) => {
      const p = productMap.get(it.product);
      if (!p) throw new ApiError(404, `Product not found: ${it.name}`);
      if (!p.isActive) throw new ApiError(400, `${p.name} is no longer available.`);
      if (p.stock < it.quantity) {
        throw new ApiError(400, `Not enough stock for ${p.name}. Available: ${p.stock}`);
      }
      return {
        product: p._id,
        name: p.name,
        image: p.images?.[0]?.url || '',
        price: p.price, // server-authoritative
        size: it.size,
        color: it.color,
        quantity: it.quantity,
      };
    });

    const subtotal = safeItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

    // Coupon
    let discount = 0;
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (!coupon || !coupon.isValid()) {
        throw new ApiError(400, 'Coupon is invalid or expired.');
      }
      if (subtotal < coupon.minOrderValue) {
        throw new ApiError(400, `Coupon requires a minimum order of ${coupon.minOrderValue}.`);
      }
      discount =
        coupon.type === 'percentage'
          ? Math.min(
            subtotal * (coupon.value / 100),
            coupon.maxDiscount ?? Infinity
          )
          : coupon.value;
      discount = Math.round(discount * 100) / 100;
    }

    const total = Math.max(0, subtotal - discount + (tax || 0) + (shippingCost || 0));

    const order = await Order.create({
      user: req.user._id,
      items: safeItems,
      shippingAddress,
      shippingMethod,
      shippingCost,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod,
      couponCode: coupon?.code || '',
      notes,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    });

    // Decrement stock + increment sold count
    await Promise.all(
      safeItems.map(async (it) => {
        await Product.findByIdAndUpdate(it.product, {
          $inc: { stock: -it.quantity, sold: +it.quantity },
        });
      })
    );

    // Mark coupon as used
    if (coupon) {
      coupon.usedCount = (coupon.usedCount || 0) + 1;
      await coupon.save();
    }

    // Clear the user's cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], couponCode: '', discount: 0 } }
    );

    res.status(201).json({ success: true, data: order });
  })
);

// PATCH /api/orders/:id/status  (admin only)
router.patch(
  '/:id/status',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const valid = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
    if (!valid.includes(status)) throw new ApiError(422, 'Invalid status');

    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, 'Order not found');

    order.status = status;
    if (status === 'delivered') order.deliveredAt = new Date();
    await order.save();

    res.json({ success: true, data: order });
  })
);

// PATCH /api/orders/:id/payment-status  (admin only)
router.patch(
  '/:id/payment-status',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { paymentStatus } = req.body;
    const valid = ['pending', 'paid', 'failed', 'refunded'];
    if (!valid.includes(paymentStatus)) throw new ApiError(422, 'Invalid payment status');

    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, 'Order not found');

    order.paymentStatus = paymentStatus;
    await order.save();

    res.json({ success: true, data: order });
  })
);

// GET /api/orders (admin) - all orders
router.get(
  '/admin/all',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [items, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
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

export default router;
