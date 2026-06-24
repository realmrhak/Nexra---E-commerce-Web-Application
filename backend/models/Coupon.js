import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: { type: String, default: '' },
    type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    value: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0, min: 0 },
    maxDiscount: { type: Number, default: null },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  const now = new Date();
  if (now < this.startDate || now > this.endDate) return false;
  if (this.usageLimit !== null && this.usedCount >= this.usageLimit) return false;
  return true;
};

export default mongoose.model('Coupon', couponSchema);
