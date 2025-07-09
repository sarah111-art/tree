import ActivityLog from '../models/activityLogModel.js';

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('staff', 'name email')
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy activity logs', error });
  }
};