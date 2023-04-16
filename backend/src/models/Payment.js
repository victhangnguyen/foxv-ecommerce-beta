import mongoose from 'mongoose';
//! const mongoose = require('mongoose');

// Define the [Payment Schema]
const paymentSchema = new mongoose.Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    amount: { type: Number, required: true },
    desc: { type: String, trim: true, required: false },
    paidDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Export function to create the [Payment Model] model class
// module.exports = mongoose.model('Payment', paymentSchema);
const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
