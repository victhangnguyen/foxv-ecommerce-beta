import mongoose from 'mongoose';

// Define the [Category Schema]
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [2, 'Thấp nhất 2 ký tự'],
      maxLength: [256, 'Nhiều nhất 256 ký tự'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
