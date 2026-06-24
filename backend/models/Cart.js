import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    size: { type: String, default: '' },
    color: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    couponCode: { type: String, default: '' },
    discount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Virtual: subtotal before discount
cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((acc, it) => acc + it.price * it.quantity, 0);
});

cartSchema.virtual('total').get(function () {
  return Math.max(0, this.subtotal - (this.discount || 0));
});

cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

export default mongoose.model('Cart', cartSchema);
