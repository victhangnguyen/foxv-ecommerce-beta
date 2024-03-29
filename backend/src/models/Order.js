import mongoose from "mongoose";

// Define the [Order Schema]
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        _id: false,
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: mongoose.Schema.Types.Number,
        slug: String,
        name: String,
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        image: String,
        price: Number,
      },
    ], //! products: Array,
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "shipped",
        "delivered",
        "completed",
        "canceled",
      ],
      default: "pending",
    },
    name: {
      type: String,
      trim: true,
      minLength: 2,
      maxLength: 64,
      required: true,
      default: null,
    },
    address: {
      type: String,
      trim: true,
      maxLength: 256,
      required: true,
      default: null,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    transactionNo: {
      type: String,
      default: "",
    },
    bankTranNo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.statics.createOrUpdateOrderByUserId = async function (
  userId,
  orderData
) {
};

const Order = mongoose.model("Order", orderSchema);
export default Order;
