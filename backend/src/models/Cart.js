import mongoose from 'mongoose';

//! imp Libraries
import Logging from '../library/Logging.js';

// Define the [Cart Schema]
const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cartItems: [
      {
        _id: false,
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        slug: String,
        name: String,
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        image: String,
        price: Number,
      },
    ],
    active: { type: Boolean, default: true },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

cartSchema.statics.createOrUpdateCartByUserId = async function (
  userId,
  update
) {
  console.log(
    '__Debugger__Cart\n__createOrUpdateCartByUserId__update: ',
    update,
    '\n'
  );
  const cart = await mongoose
    .model('Cart')
    .findOne({ user: userId, active: true });
  if (cart) {
    const currentDate = new Date();
    const msPerDay = 24 * 60 * 60 * 1000; //! 1 days: 24 * 60 * 60 * 1000

    const isExpired = cart.modifiedOn <= currentDate - 1 * msPerDay;

    if (isExpired) {
      await cart.updateOne({ active: false });
    } else {
      //! valid => update
      await cart.updateOne(update);
      return cart;
    }
  }
  return await mongoose.model('Cart').create({ user: userId, ...update });
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
