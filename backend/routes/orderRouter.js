import express from 'express';
import Order from '../models/orderModel.js';

const orderRouter = express.Router();

// 📌 Create a new order
orderRouter.post('/', async (req, res) => {
  try {
    const { customer, items, total } = req.body;

    if (!customer || !items || !total) {
      return res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
    }

    const newOrder = new Order({ customer, items, total });
    const saved = await newOrder.save();

    res.status(201).json(saved);
  } catch (error) {
    console.error('Lỗi tạo đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// 📌 Get all orders (for admin)
orderRouter.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách đơn hàng' });
  }
});

// 📌 Update order status (admin)
orderRouter.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật đơn hàng' });
  }
});
orderRouter.get('/user/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const userOrders = await Order.find({ 'customer.email': email });
    res.json(userOrders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lọc đơn hàng theo user' });
  }
});
// routes/orderRoutes.js
orderRouter.put('/:id/paid', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { isPaid: true },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái thanh toán' });
  }
});

export default orderRouter;
