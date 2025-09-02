import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone: { type: String, trim: true, match: /^[0-9+\-\s()]+$/ },
  password: { type: String, required: true },
  role: { type: String, enum: ['staff', 'manager', 'user'], default: 'user' },
}, { timestamps: true })

export default mongoose.model('User', userSchema)
