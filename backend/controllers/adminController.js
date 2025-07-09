import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const registerStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

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