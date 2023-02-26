import mongoose from 'mongoose';

// Define the [Order Schema]
const orderSchema = new mongoose.Schema({
  cartId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  shipping: Object,
  payment: Object,
  products: Array,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
