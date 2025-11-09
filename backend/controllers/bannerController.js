import Banner from "../models/bannerModel.js";
import { logActivity } from '../utils/LogActivity.js';

// Lấy danh sách
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tải banner", error });
  }
};

// Thêm mới
export const createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    
    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id,
        action: 'Thêm banner mới',
        targetType: 'Banner',
        targetId: banner._id,
        metadata: { title: banner.title || 'Banner mới' }
      });
    }
    
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Thêm banner thất bại", error });
  }
};

// Cập nhật
export const updateBanner = async (req, res) => {
  try {
    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id,
        action: 'Cập nhật banner',
        targetType: 'Banner',
        targetId: updated._id,
        metadata: { changes: Object.keys(req.body) }
      });
    }
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Cập nhật banner thất bại", error });
  }
};

// Xoá
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Không tìm thấy banner' });
    
    await Banner.findByIdAndDelete(req.params.id);
    
    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id,
        action: 'Xóa banner',
        targetType: 'Banner',
        targetId: req.params.id,
        metadata: { title: banner.title || 'Banner đã xóa' }
      });
    }
    
    res.json({ message: "Đã xoá banner" });
  } catch (error) {
    res.status(500).json({ message: "Xoá banner thất bại", error });
  }
};
