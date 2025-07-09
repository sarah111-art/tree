import ActivityLog from '../models/activityLogModel.js';

export const logActivity = async ({ staffId, action, targetType, targetId, metadata }) => {
  try {
    await ActivityLog.create({ staff: staffId, action, targetType, targetId, metadata });
  } catch (error) {
    console.error('Lỗi khi ghi activity log:', error);
  }
};