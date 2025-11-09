import express from 'express';
import Order from '../models/orderModel.js';
import { sendInvoiceEmail } from '../controllers/emailController.js';
import { logActivity } from '../utils/LogActivity.js';

const orderRouter = express.Router();

// 📌 Create a new order
orderRouter.post('/', async (req, res) => {
  try {
    const { customer, items, total, paymentMethod, orderId } = req.body;
    console.log('📦 Backend - Đang tạo đơn hàng:', { customer, items, total, paymentMethod, orderId });

    if (!customer || !items || !total) {
      return res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
    }

    const newOrder = new Order({ 
      customer, 
      items, 
      total, 
      paymentMethod: paymentMethod || 'cod',
      orderId: orderId || `ORDER_${Date.now()}`
    });
    const saved = await newOrder.save();
    console.log('✅ Backend - Đơn hàng đã tạo:', saved);

    // Gửi email hóa đơn
    try {
      await sendInvoiceEmail({ body: { order: saved } }, { 
        json: (data) => console.log('📧 Email sent:', data),
        status: (code) => ({ json: (data) => console.log('📧 Email error:', data) })
      });
      console.log('📧 Hóa đơn đã được gửi qua email');
    } catch (emailError) {
      console.error('❌ Lỗi gửi email:', emailError);
      // Không fail đơn hàng nếu gửi email thất bại
    }

    // Phát sự kiện Socket.IO cho admin
    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('order:new', {
          id: saved._id,
          total: saved.total,
          createdAt: saved.createdAt,
          customerName: saved.customer?.name,
        });
      }
    } catch (e) {
      console.error('⚠️ Socket emit error:', e);
    }

    res.status(201).json(saved);
  } catch (error) {
    console.error('❌ Backend - Lỗi tạo đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// 📌 Get all orders (for admin) with pagination
orderRouter.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await Order.countDocuments();
    
    // Get paginated orders
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    console.log(`📋 Backend - Đơn hàng trang ${page}/${totalPages} (${total} tổng):`, orders.length);
    
    res.json({
      orders,
      total,
      totalPages,
      currentPage: page,
      perPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (err) {
    console.error('❌ Backend - Lỗi lấy tất cả đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi lấy danh sách đơn hàng' });
  }
});

// 📌 Update order status (admin)
orderRouter.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id,
        action: 'Cập nhật trạng thái đơn hàng',
        targetType: 'Order',
        targetId: updated._id,
        metadata: { 
          oldStatus: order.status, 
          newStatus: status,
          orderId: updated.orderId 
        }
      });
    }
    
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
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { isPaid: true },
      { new: true }
    );
    
    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id,
        action: 'Cập nhật thanh toán đơn hàng',
        targetType: 'Order',
        targetId: updated._id,
        metadata: { orderId: updated.orderId, isPaid: true }
      });
    }
    
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
