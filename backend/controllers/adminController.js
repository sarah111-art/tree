import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const registerStaff = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (role !== 'staff') {
      return res.status(403).json({ message: 'Chỉ được tạo tài khoản staff' });
    }

    if (req.user.role !== 'manager') {
      return res.status(401).json({ message: 'Bạn không có quyền' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    res.status(201).json({ message: 'Tạo tài khoản staff thành công', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy danh sách tất cả staff
export const getAllStaffs = async (req, res) => {
  try {
    const staffs = await User.find({ role: 'staff' }).select('-password');
    res.status(200).json(staffs);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách staff', error: err.message });
  }
};

// Cập nhật email và mật khẩu của staff (chỉ manager mới được)
export const updateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { email, password } = req.body;

    // Kiểm tra quyền manager
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Bạn không có quyền cập nhật staff' });
    }

    // Tìm staff
    const staff = await User.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }

    // Kiểm tra là staff
    if (staff.role !== 'staff') {
      return res.status(403).json({ message: 'Chỉ được cập nhật tài khoản staff' });
    }

    const updateData = {};

    // Cập nhật email nếu có
    if (email !== undefined) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.trim())) {
        return res.status(400).json({ message: 'Email không hợp lệ' });
      }

      // Kiểm tra email đã tồn tại chưa (trừ chính staff này)
      const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingUser && existingUser._id.toString() !== staffId) {
        return res.status(400).json({ message: 'Email đã được sử dụng bởi tài khoản khác' });
      }

      updateData.email = email.trim().toLowerCase();
    }

    // Cập nhật mật khẩu nếu có
    if (password !== undefined) {
      if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Không có thông tin nào để cập nhật' });
    }

    // Cập nhật staff
    const updatedStaff = await User.findByIdAndUpdate(
      staffId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ 
      message: 'Cập nhật thông tin staff thành công', 
      user: updatedStaff 
    });
  } catch (error) {
    console.error('Error updating staff:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }
    res.status(500).json({ message: 'Lỗi cập nhật thông tin staff', error: error.message });
  }
};

// Xóa nhân viên (chỉ manager mới được)
export const deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    // Kiểm tra quyền manager
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa staff' });
    }

    // Tìm staff
    const staff = await User.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }

    // Kiểm tra là staff
    if (staff.role !== 'staff') {
      return res.status(403).json({ message: 'Chỉ được xóa tài khoản staff' });
    }

    // Xóa staff
    await User.findByIdAndDelete(staffId);

    res.status(200).json({ 
      message: 'Xóa nhân viên thành công'
    });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: 'Lỗi xóa nhân viên', error: error.message });
  }
};