import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js'; // đường dẫn chính xác đến model User

dotenv.config(); // nạp biến từ .env

// ⛔ Nếu dòng sau chạy khi MONGO_URL là undefined, sẽ gây lỗi:
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('✅ MongoDB connected');
}).catch((err) => {
  console.error('❌ MongoDB connect failed:', err.message);
  process.exit(1);
});

async function createManager() {
  const existing = await User.findOne({ email: 'admin@bonsai.com' });
  if (existing) {
    console.log('⚠️ Manager đã tồn tại');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const manager = new User({
    name: 'Quản trị viên',
    email: 'admin@bonsai.com',
    password: hashedPassword,
    role: 'manager',
  });

  await manager.save();
  console.log('✅ Manager account created');
  process.exit(0);
}

createManager();
