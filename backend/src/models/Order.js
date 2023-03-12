import mongoose from 'mongoose';

// Define the [Order Schema]
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }, //! products: Array,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending',
  },
  shipping: Object,
  payment: Object,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
