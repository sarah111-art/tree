import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // URL ảnh đại diện của category
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Hỗ trợ category lồng nhau (ví dụ: Bonsai > Bonsai Mini)
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    // SEO
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
  },
  { timestamps: true }
);

// Tạo slug từ name
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Category", categorySchema);
