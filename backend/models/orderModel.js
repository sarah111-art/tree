import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true }, // Thêm email field
  },
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: { type: Number, required: true },
  orderId: { type: String, unique: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled', 'paid'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'bank', 'momo', 'vnpay'],
    default: 'cod',
  },
  isPaid: { type: Boolean, default: false },
  paymentId: { type: String }, // Momo transaction ID
  paidAt: { type: Date },
  bankTransferInfo: {
    accountName: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);
