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
