import express from 'express';
import Order from '../models/orderModel.js';

const orderRouter = express.Router();

// 📌 Create a new order
orderRouter.post('/', async (req, res) => {
  try {
    const { customer, items, total } = req.body;
    console.log('📦 Backend - Đang tạo đơn hàng:', { customer, items, total });

    if (!customer || !items || !total) {
      return res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
    }

    const newOrder = new Order({ customer, items, total });
    const saved = await newOrder.save();
    console.log('✅ Backend - Đơn hàng đã tạo:', saved);

    res.status(201).json(saved);
  } catch (error) {
    console.error('❌ Backend - Lỗi tạo đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// 📌 Get all orders (for admin)
orderRouter.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    console.log('📋 Backend - Tất cả đơn hàng:', orders);
    res.json(orders);
  } catch (err) {
    console.error('❌ Backend - Lỗi lấy tất cả đơn hàng:', err);
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
  console.log('🔍 Backend - Tìm đơn hàng cho email:', email);
  try {
    const userOrders = await Order.find({ 'customer.email': email });
    console.log('📦 Backend - Kết quả tìm kiếm:', userOrders);
    res.json(userOrders);
  } catch (err) {
    console.error('❌ Backend - Lỗi tìm đơn hàng:', err);
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

// 🔍 Debug route - Kiểm tra database
orderRouter.get('/debug/all', async (req, res) => {
  try {
    const allOrders = await Order.find({});
    console.log('🔍 Debug - Tất cả đơn hàng trong DB:', allOrders);
    res.json({
      total: allOrders.length,
      orders: allOrders,
      customers: allOrders.map(order => ({
        id: order._id,
        customer: order.customer,
        createdAt: order.createdAt
      }))
    });
  } catch (err) {
    console.error('❌ Debug - Lỗi:', err);
    res.status(500).json({ error: err.message });
  }
});

export default orderRouter;
