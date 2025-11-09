import mongoose from "mongoose";

const footerSchema = new mongoose.Schema(
  {
    companyInfo: {
      title: { type: String, required: true },
      description: { type: String },
    },
    menuLinks: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    supportInfo: {
      openingHours: { type: String },
      hotline: { type: String },
      salesPhone: { type: String },
      feedbackPhone: { type: String },
      email: { type: String },
    },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      zalo: { type: String },
      youtube: { type: String },
    },
    copyright: {
      text: { type: String, required: true },
      year: { type: String },
      website: { type: String },
    },
    backgroundImage: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.model("Footer", footerSchema);
