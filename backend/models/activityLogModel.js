import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Hoặc 'Staff'
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  targetType: String, // "Banner", "Product", "Post", ...
  targetId: mongoose.Schema.Types.ObjectId,
  metadata: Object,
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model('ActivityLog', activityLogSchema);