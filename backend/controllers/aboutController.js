import About from '../models/aboutModel.js';
import { logActivity } from '../utils/LogActivity.js';

// Lấy tất cả phần giới thiệu
export const getAllAbouts = async (req, res) => {
  try {
    const abouts = await About.find().sort({ createdAt: -1 });
    res.json(abouts);
  } catch (error) {
    console.error('Error fetching abouts:', error);
    res.status(500).json({ message: 'Lỗi lấy danh sách giới thiệu', error: error.message });
  }
};

// Lấy phần giới thiệu active (cho frontend)
export const getActiveAbout = async (req, res) => {
  try {
    const about = await About.findOne({ status: 'active' }).sort({ createdAt: -1 });
    if (!about) {
      return res.status(404).json({ message: 'Không tìm thấy phần giới thiệu' });
    }
    res.json(about);
  } catch (error) {
    console.error('Error fetching active about:', error);
    res.status(500).json({ message: 'Lỗi lấy phần giới thiệu', error: error.message });
  }
};

// Lấy phần giới thiệu theo ID
export const getAboutById = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) {
      return res.status(404).json({ message: 'Không tìm thấy phần giới thiệu' });
    }
    res.json(about);
  } catch (error) {
    console.error('Error fetching about by ID:', error);
    res.status(500).json({ message: 'Lỗi lấy phần giới thiệu', error: error.message });
  }
};

// Tạo phần giới thiệu mới
export const createAbout = async (req, res) => {
  try {
    const {
      title,
      content,
      image,
      images,
      status,
      metaTitle,
      metaDescription,
      metaKeywords,
      mission,
      vision,
      values
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Tiêu đề và nội dung là bắt buộc' });
    }

    // Nếu set status active, set các phần khác thành inactive
    if (status === 'active') {
      await About.updateMany({ status: 'active' }, { status: 'inactive' });
    }

    const newAbout = await About.create({
      title,
      content,
      image,
      images: Array.isArray(images) ? images : [],
      status: status || 'active',
      metaTitle,
      metaDescription,
      metaKeywords: Array.isArray(metaKeywords) ? metaKeywords : [],
      mission,
      vision,
      values: Array.isArray(values) ? values : []
    });

    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id,
        action: 'Tạo phần giới thiệu mới',
        targetType: 'About',
        targetId: newAbout._id,
        metadata: { title: newAbout.title }
      });
    }

    res.status(201).json({ message: 'Tạo phần giới thiệu thành công', about: newAbout });
  } catch (error) {
    console.error('Error creating about:', error);
    res.status(500).json({ message: 'Lỗi tạo phần giới thiệu', error: error.message });
  }
};

// Cập nhật phần giới thiệu
export const updateAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      image,
      images,
      status,
      metaTitle,
      metaDescription,
      metaKeywords,
      mission,
      vision,
      values
    } = req.body;

    const about = await About.findById(id);
    if (!about) {
      return res.status(404).json({ message: 'Không tìm thấy phần giới thiệu' });
    }

    // Nếu set status active, set các phần khác thành inactive
    if (status === 'active' && about.status !== 'active') {
      await About.updateMany({ status: 'active', _id: { $ne: id } }, { status: 'inactive' });
    }

    const updatedAbout = await About.findByIdAndUpdate(
      id,
      {
        title,
        content,
        image,
        images: Array.isArray(images) ? images : [],
        status,
        metaTitle,
        metaDescription,
        metaKeywords: Array.isArray(metaKeywords) ? metaKeywords : [],
        mission,
        vision,
        values: Array.isArray(values) ? values : []
      },
      { new: true, runValidators: true }
    );

    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id,
        action: 'Cập nhật phần giới thiệu',
        targetType: 'About',
        targetId: updatedAbout._id,
        metadata: { title: updatedAbout.title }
      });
    }

    res.json({ message: 'Cập nhật phần giới thiệu thành công', about: updatedAbout });
  } catch (error) {
    console.error('Error updating about:', error);
    res.status(500).json({ message: 'Lỗi cập nhật phần giới thiệu', error: error.message });
  }
};

// Xóa phần giới thiệu
export const deleteAbout = async (req, res) => {
  try {
    const { id } = req.params;

    const about = await About.findById(id);
    if (!about) {
      return res.status(404).json({ message: 'Không tìm thấy phần giới thiệu' });
    }

    await About.findByIdAndDelete(id);

    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id,
        action: 'Xóa phần giới thiệu',
        targetType: 'About',
        targetId: id,
        metadata: { title: about.title }
      });
    }

    res.json({ message: 'Xóa phần giới thiệu thành công' });
  } catch (error) {
    console.error('Error deleting about:', error);
    res.status(500).json({ message: 'Lỗi xóa phần giới thiệu', error: error.message });
  }
};

