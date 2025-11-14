import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  const { name, email, password, phone } = req.body
  const hashed = await bcrypt.hash(password, 10)
  try {
    const newUser = await User.create({ name, email, password: hashed, phone })
    res.json(newUser)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ message: 'User not found' })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(401).json({ message: 'Wrong password' })

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET)
  res.json({ token, user })
}

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await User.countDocuments();
    
    // Get paginated users
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    console.log(`👥 Backend - Users trang ${page}/${totalPages} (${total} tổng):`, users.length);
    
    res.json({
      users,
      total,
      totalPages,
      currentPage: page,
      perPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('❌ Backend - Lỗi lấy danh sách users:', error);
    res.status(500).json({ message: 'Lỗi lấy danh sách người dùng' });
  }
}

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Cập nhật thông tin profile (tên và email)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ token đã decode
    const { name, email } = req.body;

    const updateData = {};

    if (name !== undefined) {
      if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Tên không được để trống' });
      }
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.trim())) {
        return res.status(400).json({ message: 'Email không hợp lệ' });
      }

      // Kiểm tra email đã tồn tại chưa (trừ chính user hiện tại)
      const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: 'Email đã được sử dụng bởi tài khoản khác' });
      }

      updateData.email = email.trim().toLowerCase();
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Không có thông tin nào để cập nhật' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password'); // Không trả về password

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json({ message: 'Cập nhật thông tin thành công', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }
    res.status(500).json({ message: 'Lỗi cập nhật thông tin' });
  }
}

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ token đã decode
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Kiểm tra mật khẩu cũ
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Mật khẩu cũ không đúng' });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Lỗi đổi mật khẩu' });
  }
}
