import mongoose from "mongoose";
const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    link: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    position: { type: String, enum: ['homepage', 'sidebar', 'footer'], default: 'homepage' },
    startDate: { type: Date }, // ✅ thêm vào
    endDate: { type: Date },   // ✅ thêm vào
  },
  { timestamps: true }
);
export default mongoose.model("Banner", bannerSchema);
