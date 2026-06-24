import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Category name too short'],
      maxlength: [60, 'Category name too long'],
    },
    slug: { type: String, unique: true, index: true },
    icon: { type: String, default: '' },
    image: {
      url: { type: String, default: '' },
      public_id: { type: String, default: '' },
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.pre('validate', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

categorySchema.index({ parent: 1 });

export default mongoose.model('Category', categorySchema);
