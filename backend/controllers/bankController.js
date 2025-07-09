// ✅ CONTROLLER: controllers/bankController.js (Chuyển khoản ngân hàng thủ công)

// Đây là controller mô phỏng gửi đơn hàng và hiển thị thông tin chuyển khoản ngân hàng

import Order from '../models/orderModel.js';

export const createBankOrder = async (req, res) => {
  try {
    const { customer, items, total } = req.body;

    if (!customer || !items || !total) {
      return res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
    }

    const newOrder = new Order({ customer, items, total, paymentMethod: 'bank', status: 'pending' });
    const saved = await newOrder.save();

    res.status(201).json({
      message: 'Đơn hàng đã được tạo. Vui lòng chuyển khoản theo thông tin bên dưới.',
      order: saved,
      bankInfo: {
        bankName: 'Ngân hàng Vietcombank',
        accountNumber: '0123456789',
        accountName: 'CTY TNHH BONSAI VIET',
        content: `Thanh toan DH#${saved._id}`,
      },
    });
  } catch (err) {
    console.error('Lỗi tạo đơn hàng ngân hàng:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
