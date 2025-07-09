// models/contactModel.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'processed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
