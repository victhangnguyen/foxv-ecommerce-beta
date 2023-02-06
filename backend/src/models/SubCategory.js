import mongoose from 'mongoose';

// Define the [SubCategory Schema]
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: [2, 'Thấp nhất 2 ký tự'],
      maxLength: [256, 'Nhiều nhất 256 ký tự'],
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true }
);

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
export default SubCategory;
