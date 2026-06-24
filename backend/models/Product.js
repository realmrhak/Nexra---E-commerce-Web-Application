import mongoose from 'mongoose';
import slugify from 'slugify';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name too short'],
      maxlength: [200, 'Product name too long'],
    },
    slug: { type: String, unique: true, index: true },
    description: { type: String, trim: true, default: '' },
    brand: { type: String, trim: true, default: 'Generic' },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    oldPrice: { type: Number, min: 0, default: null },
    currency: { type: String, default: 'USD' },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, default: '' },
      },
    ],

    sizes: [{ type: String, trim: true }],
    colors: [{ type: String, trim: true }],

    stock: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0, min: 0 },

    // ratings aggregate
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    reviews: [reviewSchema],

    // misc
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }],

    // shipping
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

productSchema.pre('validate', function (next) {
  if (this.isModified('name') || !this.slug) {
    let base = slugify(this.name, { lower: true, strict: true });
    if (!base) base = 'product';
    // ensure uniqueness with short hash suffix
    this.slug = `${base}-${Date.now().toString(36).slice(-4)}`;
  }
  next();
});

// Recalculate aggregate rating when reviews change
productSchema.methods.recalcRatings = function () {
  if (!this.reviews || this.reviews.length === 0) {
    this.ratings = 0;
    this.numReviews = 0;
    return this;
  }
  const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  this.ratings = Number((sum / this.reviews.length).toFixed(2));
  this.numReviews = this.reviews.length;
  return this;
};

// Text + compound indexes for search performance
// (slug is already indexed via `unique: true` in the schema above)
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ isNew: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

export default mongoose.model('Product', productSchema);
