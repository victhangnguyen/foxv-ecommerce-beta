import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

//! imp Services
import userService from '../services/userService.js';

// Define the [User Schema]
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      minLength: [2, 'Thấp nhất 2 ký tự'],
      maxLength: [32, 'Nhiều nhất 32 ký tự'],
      required: true,
    },
    lastName: {
      type: String,
      minLength: [2, 'Thấp nhất 2 ký tự'],
      maxLength: [32, 'Nhiều nhất 32 ký tự'],
      required: true,
    },
    doB: {
      type: Date,
      require: true,
    },
    phoneNumber: {
      type: String,
      minLength: [8, 'Thấp nhất 8 ký tự'],
      maxLength: [32, 'Nhiều nhất 32 ký tự'],
      required: true,
    },
    password: {
      type: String,
      minLength: [8, 'Thấp nhất 8 ký tự'],
      maxLength: [64, 'Nhiều nhất 64 ký tự'],
      required: true,
    },
    image: {
      type: String,
    },
    googleId: {
      type: String,
      required: false,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        default: async function () {
          const role = await mongoose.model('Role').findOne({ name: 'user' });
          return [role._id];
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'active', 'inactive', 'deleting'],
      default: 'pending',
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare the given password with the hashed one
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.resetPassword = async function (session) {
  const newPassword = userService.generatePassword();
  this.password = newPassword;
  // this.password = new
  await this.save({ session });

  return newPassword;
};

const User = mongoose.model('User', userSchema);
export default User;
