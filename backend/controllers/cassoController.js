// controllers/cassoController.js
import Order from '../models/orderModel.js';

// Xử lý webhook từ Casso
export const handleCassoWebhook = async (req, res) => {
  try {
    const { data, secure_token } = req.body;
    
    // Verify webhook token
    if (secure_token !== process.env.CASSO_SECURE_TOKEN) {
      console.error('❌ Invalid Casso webhook token');
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    console.log('📥 Nhận webhook từ Casso:', data);
    
    // Process từng giao dịch
    for (const transaction of data) {
      const { 
        description, 
        amount, 
        when, 
        bank_sub_acc_id,
        tid,
        casso_id
      } = transaction;
      
      // Tìm mã đơn hàng từ description
      const orderMatch = description.match(/DH(\d+)/i);
      if (orderMatch) {
        const orderID = orderMatch[1];
        
        try {
          // Tìm đơn hàng
          const order = await Order.findOne({ 
            orderId: orderID,
            status: { $in: ['pending', 'processing'] }
          });
          
          if (order) {
            // Kiểm tra số tiền
            if (Math.abs(order.total - amount) <= 1000) { // Cho phép sai số 1000đ
              // Cập nhật trạng thái đơn hàng
              order.status = 'paid';
              order.paymentMethod = 'bank';
              order.paymentId = tid || casso_id;
              order.paidAt = new Date(when * 1000);
              order.paymentDetails = {
                bankTransactionId: tid,
                cassoId: casso_id,
                bankSubAccId: bank_sub_acc_id,
                receivedAmount: amount,
                description: description
              };
              
              await order.save();
              
              console.log(`✅ Đã nhận thanh toán cho đơn hàng ${orderID}: ${amount} VNĐ`);
              
              // TODO: Gửi email xác nhận thanh toán
              // TODO: Gửi thông báo cho admin
            } else {
              console.warn(`⚠️ Số tiền không khớp cho đơn ${orderID}: Đơn hàng ${order.total} VNĐ, Nhận ${amount} VNĐ`);
            }
          } else {
            console.warn(`⚠️ Không tìm thấy đơn hàng ${orderID} hoặc đã thanh toán`);
          }
        } catch (dbError) {
          console.error(`❌ Lỗi cập nhật đơn hàng ${orderID}:`, dbError);
        }
      } else {
        console.log(`ℹ️ Giao dịch không phải đơn hàng: ${description}`);
      }
    }
    
    res.status(200).json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('❌ Lỗi xử lý webhook Casso:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// API check trạng thái thanh toán
export const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    
    res.json({
      orderId: order.orderId,
      status: order.status,
      paid: order.status === 'paid',
      amount: order.total,
      paidAt: order.paidAt,
      paymentMethod: order.paymentMethod
    });
  } catch (error) {
    console.error('❌ Lỗi check payment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Tạo QR thanh toán động
export const createPaymentQR = async (req, res) => {
  try {
    const { orderId, amount, description } = req.body;
    
    if (!orderId || !amount) {
      return res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
    }
    
    // Import QR generator
    const { generatePaymentQR, validateBankInfo } = await import('../utils/qrGenerator.js');
    
    // Validate thông tin ngân hàng
    try {
      validateBankInfo();
    } catch (error) {
      return res.status(500).json({ 
        message: 'Chưa cấu hình thông tin ngân hàng',
        error: error.message 
      });
    }
    
    // Tạo QR
    const qrData = await generatePaymentQR(orderId, amount, description);
    
    res.json({
      success: true,
      qrImage: qrData.qrImage,
      transferInfo: qrData.transferInfo
    });
  } catch (error) {
    console.error('❌ Lỗi tạo QR thanh toán:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
