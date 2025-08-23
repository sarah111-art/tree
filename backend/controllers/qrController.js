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
  const { type, imageUrl, phoneNumber, accountName, bankCode, accountNumber } = req.body;
  if (!type || !imageUrl) {
    return res.status(400).json({ message: 'Thiếu dữ liệu' });
  }

  // Validate Momo specific fields
  if (type === 'momo' && (!phoneNumber || !accountName)) {
    return res.status(400).json({ message: 'Momo QR cần số điện thoại và tên tài khoản' });
  }

  // Validate VNPay specific fields
  if (type === 'vnpay' && (!bankCode || !accountNumber)) {
    return res.status(400).json({ message: 'VNPay QR cần mã ngân hàng và số tài khoản' });
  }

  try {
    const existing = await QR.findOne({ type });
    if (existing) {
      existing.imageUrl = imageUrl;
      if (type === 'momo') {
        existing.phoneNumber = phoneNumber;
        existing.accountName = accountName;
      } else if (type === 'vnpay') {
        existing.bankCode = bankCode;
        existing.accountNumber = accountNumber;
      }
      await existing.save();
      return res.json({ message: 'Cập nhật thành công', qr: existing });
    }

    const qrData = { type, imageUrl };
    if (type === 'momo') {
      qrData.phoneNumber = phoneNumber;
      qrData.accountName = accountName;
    } else if (type === 'vnpay') {
      qrData.bankCode = bankCode;
      qrData.accountNumber = accountNumber;
    }

    const newQR = await QR.create(qrData);
    res.status(201).json({ message: 'Tạo mới thành công', qr: newQR });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lưu mã QR', error: err.message });
  }
};

export const getMomoQR = async (req, res) => {
  try {
    const momoQR = await QR.findOne({ type: 'momo', isActive: true });
    if (!momoQR) {
      return res.status(404).json({ message: 'Không tìm thấy QR Momo' });
    }
    res.json(momoQR);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy QR Momo', error: err.message });
  }
};

export const getVNPayQR = async (req, res) => {
  try {
    const vnpayQR = await QR.findOne({ type: 'vnpay', isActive: true });
    if (!vnpayQR) {
      return res.status(404).json({ message: 'Không tìm thấy QR VNPay' });
    }
    res.json(vnpayQR);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy QR VNPay', error: err.message });
  }
};
