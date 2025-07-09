// models/qrModel.js
import mongoose from 'mongoose';

const qrSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['momo', 'bank'],
    required: true,
    unique: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});

export default mongoose.model('QR', qrSchema);
