import mongoose from 'mongoose';

// Define the [User Schema]
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [2, 'Thấp nhất 2 ký tự'],
      maxLength: [256, 'Nhiều nhất 256 ký tự'],
      required: true,
    },
    doB: {
      type: Date,
      require: true,
    },
    phoneNumber: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minLength: [8, 'Thấp nhất 8 ký tự'],
      maxLength: [256, 'Nhiều nhất 256 ký tự'],
      required: true,
    },
    image: {
      type: String,
    },
    googleId: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ['user', 'subscriber', 'admin'],
      default: 'user',
      required: true,
    },
    status: {
      type: String,
      default: 'inactive',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
