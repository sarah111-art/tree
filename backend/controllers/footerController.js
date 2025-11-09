import Footer from "../models/footerModel.js";
import { logActivity } from '../utils/LogActivity.js';

// Lấy danh sách
export const getAllFooters = async (req, res) => {
  try {
    const footers = await Footer.find().sort({ createdAt: -1 });
    res.json(footers);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tải footer", error });
  }
};

// Lấy footer active
export const getActiveFooter = async (req, res) => {
  try {
    // Tìm footer có status 'active', nếu không có thì lấy footer mới nhất
    let footer = await Footer.findOne({ status: 'active' });
    if (!footer) {
      footer = await Footer.findOne().sort({ createdAt: -1 });
    }
    res.json(footer || null);
  } catch (error) {
    console.error('Lỗi khi lấy footer active:', error);
    res.status(500).json({ message: "Lỗi khi tải footer", error });
  }
};

// Thêm mới
export const createFooter = async (req, res) => {
  try {
    // Lọc bỏ menu links rỗng
    if (req.body.menuLinks && Array.isArray(req.body.menuLinks)) {
      req.body.menuLinks = req.body.menuLinks.filter(
        link => link.title && link.title.trim() && link.url && link.url.trim()
      );
    }
    
    const footer = await Footer.create(req.body);
    
    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id || req.user.id,
        action: 'Thêm footer mới',
        targetType: 'Footer',
        targetId: footer._id,
        metadata: { title: footer.companyInfo?.title || 'Footer mới' }
      });
    }
    
    res.status(201).json(footer);
  } catch (error) {
    console.error('Lỗi khi tạo footer:', error);
    const errorMessage = error.message || 'Thêm footer thất bại';
    const validationErrors = error.errors ? Object.keys(error.errors).map(key => error.errors[key].message).join(', ') : '';
    res.status(500).json({ 
      message: validationErrors || errorMessage, 
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Cập nhật
export const updateFooter = async (req, res) => {
  try {
    // Lọc bỏ menu links rỗng
    if (req.body.menuLinks && Array.isArray(req.body.menuLinks)) {
      req.body.menuLinks = req.body.menuLinks.filter(
        link => link.title && link.title.trim() && link.url && link.url.trim()
      );
    }
    
    const updated = await Footer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy footer' });
    }
    
    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id || req.user.id,
        action: 'Cập nhật footer',
        targetType: 'Footer',
        targetId: updated._id,
        metadata: { changes: Object.keys(req.body) }
      });
    }
    
    res.json(updated);
  } catch (error) {
    console.error('Lỗi khi cập nhật footer:', error);
    const errorMessage = error.message || 'Cập nhật footer thất bại';
    const validationErrors = error.errors ? Object.keys(error.errors).map(key => error.errors[key].message).join(', ') : '';
    res.status(500).json({ 
      message: validationErrors || errorMessage, 
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Xoá
export const deleteFooter = async (req, res) => {
  try {
    const footer = await Footer.findById(req.params.id);
    if (!footer) return res.status(404).json({ message: 'Không tìm thấy footer' });
    
    await Footer.findByIdAndDelete(req.params.id);
    
    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id || req.user.id,
        action: 'Xóa footer',
        targetType: 'Footer',
        targetId: req.params.id,
        metadata: { title: footer.companyInfo?.title || 'Footer đã xóa' }
      });
    }
    
    res.json({ message: "Đã xoá footer" });
  } catch (error) {
    res.status(500).json({ message: "Xoá footer thất bại", error });
  }
};
