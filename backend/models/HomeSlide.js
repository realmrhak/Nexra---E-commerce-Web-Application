import mongoose from 'mongoose';

/**
 * HomeSlide — represents one card in the admin-curated "Best Sellers" slider
 * on the home page. Each slide references a Product; the admin picks which
 * products appear and in what order via the pencil-icon editor on the home page.
 */
const homeSlideSchema = new mongoose.Schema(
  {
    // The product displayed in this slide
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    // Optional custom badge override (e.g. "28% OFF", "BESTSELLER")
    // If empty, the slide auto-calculates discount from product.oldPrice
    badge: { type: String, default: '', trim: true },
    // Optional custom title override (if empty, uses product.name)
    customTitle: { type: String, default: '', trim: true },
    // Display order (lower = earlier in slider)
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

homeSlideSchema.index({ order: 1, isActive: 1 });
homeSlideSchema.index({ product: 1 });

export default mongoose.model('HomeSlide', homeSlideSchema);
