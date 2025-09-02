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
  const users = await User.find()
  res.json(users)
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
