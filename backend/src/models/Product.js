import mongoose from 'mongoose';
//! StatusSchema
const statusSchema = new mongoose.Schema({
  value: {
    type: String,
    enum: ['none', 'new', 'trend', 'sale', 'event', 'freeship'],
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 256,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 1024,
      text: true,
    },
    price: {
      type: Number,
      // require: true,
      trim: true,
      min: 0,
      max: 10000000,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
      },
    ],
    sold: { type: Number, default: 0 },
    quantity: {
      type: Number,
      // require: true,
      trim: true,
      min: 0,
      max: 10000000,
      default: 0,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    images: [{ type: String }],
    color: {
      type: String,
      // enum: ['black', 'brown', 'silver', 'white', 'blue'],
    },
    brand: {
      type: String,
      // enum: ['luis-vuiton', 'gucci', 'dior'],
    },
    discount: {
      type: Number,
      trim: true,
      maxLength: 32,
      default: 0,
    },
    status: {
      type: [statusSchema],
      default: { value: 'new' },
      refs: statusSchema,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
