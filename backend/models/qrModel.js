// models/qrModel.js
import mongoose from 'mongoose';

const qrSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['momo', 'bank', 'vnpay'],
    required: true,
    unique: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: function() { return this.type === 'momo'; }
  },
  accountName: {
    type: String,
    required: function() { return this.type === 'momo'; }
  },
  bankCode: {
    type: String,
    required: function() { return this.type === 'vnpay'; }
  },
  accountNumber: {
    type: String,
    required: function() { return this.type === 'vnpay'; }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('QR', qrSchema);
