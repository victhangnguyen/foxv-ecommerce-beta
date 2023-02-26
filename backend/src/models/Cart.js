import mongoose from 'mongoose';

// Define the [Cart Schema]
const cartSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  status: { type: String, default: 'active' },
  products: Array,
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
