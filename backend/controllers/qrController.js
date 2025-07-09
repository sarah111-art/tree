// controllers/qrController.js
import QR from '../models/qrModel.js';

export const getAllQR = async (req, res) => {
  try {
    const qrList = await QR.find();
    res.json(qrList);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách QR', error: err.message });
  }
};

export const uploadOrUpdateQR = async (req, res) => {
  const { type, imageUrl } = req.body;
  if (!type || !imageUrl) {
    return res.status(400).json({ message: 'Thiếu dữ liệu' });
  }

  try {
    const existing = await QR.findOne({ type });
    if (existing) {
      existing.imageUrl = imageUrl;
      await existing.save();
      return res.json({ message: 'Cập nhật thành công', qr: existing });
    }

    const newQR = await QR.create({ type, imageUrl });
    res.status(201).json({ message: 'Tạo mới thành công', qr: newQR });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lưu mã QR', error: err.message });
  }
};
