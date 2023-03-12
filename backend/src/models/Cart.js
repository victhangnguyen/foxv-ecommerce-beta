import mongoose from 'mongoose';

// Define the [Cart Schema]
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'active' },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
