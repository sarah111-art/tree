import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true },
    content: { type: String, required: true },
    image: { type: String },
    images: { type: [String], default: [] },
    status: { type: String, enum: ["published", "draft"], default: "draft" },
    category: { type: String },

    // ✅ SEO Fields
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
