import mongoose from "mongoose";
import bcrypt from "bcryptjs";

//! imp Services
import userService from "../services/userService.js";

// Define the [User Schema]
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: [2, "Thấp nhất 2 ký tự"],
      maxLength: [32, "Nhiều nhất 32 ký tự"],
      required: true,
    },
    lastName: {
      type: String,
      minLength: [2, "Thấp nhất 2 ký tự"],
      maxLength: [32, "Nhiều nhất 32 ký tự"],
      required: true,
    },
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
    doB: {
      type: Date,
      require: true,
    },
    phoneNumber: {
      type: String,
      minLength: [8, "Thấp nhất 8 ký tự"],
      maxLength: [32, "Nhiều nhất 32 ký tự"],
      required: true,
    },
    password: {
      type: String,
      minLength: [8, "Thấp nhất 8 ký tự"],
      maxLength: [64, "Nhiều nhất 64 ký tự"],
      required: true,
    },
    image: {
      type: String,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "active", "inactive", "deleting"],
      default: "pending",
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  const userRole = await mongoose.model("Role").findOne({ name: "user" });
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    //! active Account
    this.roles = [userRole._id];
  }
  next();
});

// Compare the given password with the hashed one
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.resetPassword = async function (session) {
  try {
    const newPassword = userService.generatePassword();
    this.password = newPassword;
    // this.password = new
    await this.save({ session });
  } catch (error) {
    throw error;
  }

  return newPassword;
};

const User = mongoose.model("User", userSchema);
export default User;
