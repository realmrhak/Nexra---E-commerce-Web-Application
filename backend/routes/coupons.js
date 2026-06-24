import express from 'express';
import Coupon from '../models/Coupon.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/error.js';

const router = express.Router();

// POST /api/coupons/validate  { code, subtotal }
router.post(
  '/validate',
  protect,
  asyncHandler(async (req, res) => {
    const { code, subtotal = 0 } = req.body;
    if (!code) throw new ApiError(422, 'Coupon code is required.');

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon || !coupon.isValid()) {
      throw new ApiError(400, 'Coupon is invalid or expired.');
    }
    if (subtotal < coupon.minOrderValue) {
      throw new ApiError(
        400,
        `Coupon requires a minimum subtotal of ${coupon.minOrderValue}.`
      );
    }
    const discount =
      coupon.type === 'percentage'
        ? Math.min(subtotal * (coupon.value / 100), coupon.maxDiscount ?? Infinity)
        : coupon.value;

    res.json({
      success: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: Math.round(discount * 100) / 100,
      },
    });
  })
);

export default router;
