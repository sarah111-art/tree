import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    images: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    // SEO fields
    metaTitle: {
      type: String,
      trim: true
    },
    metaDescription: {
      type: String,
      trim: true
    },
    metaKeywords: [String],
    // Thông tin bổ sung
    mission: {
      type: String
    },
    vision: {
      type: String
    },
    values: [String]
  },
  { timestamps: true }
);

export default mongoose.model('About', aboutSchema);

