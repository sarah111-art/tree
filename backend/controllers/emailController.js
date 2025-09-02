import nodemailer from 'nodemailer';
import jsPDF from 'jspdf';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Test endpoint để kiểm tra API
export const testEmail = async (req, res) => {
  try {
    console.log('🧪 Test endpoint được gọi');
    console.log('🧪 Request body:', JSON.stringify(req.body, null, 2));
    console.log('🧪 Request headers:', req.headers);
    
    res.json({ 
      success: true, 
      message: 'Test endpoint hoạt động bình thường',
      receivedData: req.body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Lỗi test endpoint:', error);
    res.status(500).json({ message: 'Lỗi test endpoint' });
  }
};

export const sendInvoiceEmail = async (req, res) => {
  try {
    console.log('📧 Bắt đầu gửi email hóa đơn...');
    console.log('📧 Raw body:', JSON.stringify(req.body, null, 2));
    // Chuẩn hoá dữ liệu đầu vào để tránh lỗi 400/500 do khác cấu trúc
    const body = req.body || {};
    const node = body.order || {};
    const normalizedOrderId = body.orderId || node._id || node.orderNumber || body._id || `ORDER_${Date.now()}`;
    const normalizedCustomerEmail = body.customerEmail || node.customer?.email || body.email || '';
    const normalizedCustomerName = body.customerName || node.customer?.name || body.name || '';
    const normalizedOrderDetails = body.orderDetails || {
      items: node.items || [],
      total: node.total,
      paymentMethod: node.paymentMethod,
      orderDate: node.createdAt,
      shippingAddress: node.customer?.address,
      phone: node.customer?.phone,
    };

    // Gán về các tên dùng phía dưới (sau khi đã khởi tạo đầy đủ)
    const orderId = normalizedOrderId;
    const customerEmail = normalizedCustomerEmail;
    const customerName = normalizedCustomerName;
    const orderDetails = normalizedOrderDetails;

    console.log('📧 Parsed:', {
      orderId,
      customerEmail,
      customerName,
      items: Array.isArray(orderDetails?.items) ? orderDetails.items.length : 0,
      total: orderDetails?.total,
      paymentMethod: orderDetails?.paymentMethod,
      phone: orderDetails?.phone,
      shippingAddress: orderDetails?.shippingAddress,
    });

    // Kiểm tra dữ liệu đầu vào
    if (!orderId) {
      console.error('❌ Thiếu orderId');
      return res.status(400).json({ message: 'Thiếu mã đơn hàng' });
    }
    
    if (!customerEmail) {
      console.error('❌ Thiếu email khách hàng');
      return res.status(400).json({ message: 'Thiếu email khách hàng' });
    }
    
    if (!customerName) {
      console.error('❌ Thiếu tên khách hàng');
      return res.status(400).json({ message: 'Thiếu tên khách hàng' });
    }
    
    if (!orderDetails) {
      console.error('❌ Thiếu chi tiết đơn hàng');
      return res.status(400).json({ message: 'Thiếu chi tiết đơn hàng' });
    }

    // Kiểm tra các trường bắt buộc trong orderDetails
    console.log('🔍 Kiểm tra orderDetails.items:', orderDetails.items);
    if (!orderDetails.items || !Array.isArray(orderDetails.items) || orderDetails.items.length === 0) {
      console.error('❌ Thiếu hoặc sai định dạng danh sách sản phẩm:', orderDetails.items);
      return res.status(400).json({ 
        message: 'Thiếu danh sách sản phẩm',
        received: orderDetails.items 
      });
    }
    
    // Tính lại tổng tiền nếu thiếu/không hợp lệ thay vì trả 400
    let computedTotal = Number(orderDetails.total || 0);
    if (!computedTotal || computedTotal <= 0) {
      computedTotal = (orderDetails.items || []).reduce((sum, it) => {
        const price = Number(it.price || 0);
        const qty = Number(it.quantity || 1);
        return sum + price * qty;
      }, 0);
      console.log('🧮 Tổng tiền được tính lại:', computedTotal);
    }

    // Tạo order object để tương thích với code hiện tại
    const order = {
      _id: orderId,
      orderNumber: orderId,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: orderDetails.phone || 'N/A',
        address: orderDetails.shippingAddress || 'N/A'
      },
      items: orderDetails.items,
      total: computedTotal,
      paymentMethod: orderDetails.paymentMethod || 'cod',
      createdAt: orderDetails.orderDate || new Date().toISOString(),
      status: 'pending'
    };

    // Validate email configuration
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.error('❌ Thiếu cấu hình email:', {
        MAIL_USER: !!process.env.MAIL_USER,
        MAIL_PASS: !!process.env.MAIL_PASS
      });
      // Không chặn luồng đặt hàng
      return res.json({ 
        success: false, 
        message: 'Chưa cấu hình email server. Bỏ qua bước gửi email.' 
      });
    }

    // Validate order data
    if (!order.customer?.email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Khách hàng chưa có email' 
      });
    }

    console.log('📧 Gửi email đến:', order.customer.email);
    console.log('📧 Từ email:', process.env.MAIL_USER);

    console.log('🧾 Bắt đầu tạo PDF hoá đơn');
    let pdfBuffer = null;
    let pdfError = null;
    let doc;
    try {
      // Tạo PDF hóa đơn
      doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text('HOA DON BAN HANG', 105, 25, { align: 'center' });
    
    // Reset color
    doc.setTextColor(0, 0, 0);
    
    // Company info
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text('BONSAI SHOP', 20, 45);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Dia chi: 123 Duong ABC, Quan XYZ, TP.HCM', 20, 55);
    doc.text('Dien thoai: 0123 456 789', 20, 60);
    doc.text('Email: info@bonsaishop.com', 20, 65);
    
    // Invoice info
    doc.setFontSize(11);
    doc.text(`Ma hoa don: ${order.orderNumber || order._id}`, 120, 45);
    doc.text(`Ngay: ${new Date(order.createdAt).toLocaleDateString('vi-VN')}`, 120, 55);
    doc.text(`Trang thai: ${getStatusText(order.status)}`, 120, 65);
    
    // Customer info
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text('THONG TIN KHACH HANG', 20, 85);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Ten: ${order.customer?.name || 'N/A'}`, 20, 95);
    doc.text(`SDT: ${order.customer?.phone || 'N/A'}`, 20, 100);
    doc.text(`Dia chi: ${order.customer?.address || 'N/A'}`, 20, 105);
    doc.text(`Email: ${order.customer?.email || 'N/A'}`, 20, 110);
    
    // Payment info
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text('THONG TIN THANH TOAN', 20, 130);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Phuong thuc: ${getPaymentMethodText(order.paymentMethod)}`, 20, 140);
    
    // Items header
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text('CHI TIET SAN PHAM', 20, 160);
    
    // Items table header
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('STT', 20, 175);
    doc.text('San pham', 35, 175);
    doc.text('SL', 120, 175);
    doc.text('Don gia', 140, 175);
    doc.text('Thanh tien', 170, 175);
    
    // Draw table lines
    doc.setDrawColor(34, 197, 94);
    doc.line(20, 180, 190, 180);
    
    // Items
    let yPosition = 190;
    order.items.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text((index + 1).toString(), 20, yPosition);
      doc.text(item.name, 35, yPosition);
      doc.text(item.quantity.toString(), 120, yPosition);
      doc.text(`${item.price?.toLocaleString()} VND`, 140, yPosition);
      doc.text(`${(item.price * item.quantity)?.toLocaleString()} VND`, 170, yPosition);
      
      yPosition += 12;
    });
    
    // Total line
    doc.setDrawColor(34, 197, 94);
    doc.line(20, yPosition + 5, 190, yPosition + 5);
    
    // Total
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text(`Tong cong: ${order.total?.toLocaleString()} VND`, 150, yPosition + 15);
    
    // Footer
    doc.setFontSize(12);
    doc.setTextColor(128, 128, 128);
    doc.text('Cam on quy khach da mua hang!', 105, yPosition + 30, { align: 'center' });
    doc.text('Hen gap lai quy khach!', 105, yPosition + 35, { align: 'center' });
    
      // Convert PDF to base64 
      const pdfBase64 = doc.output('datauristring').split(',')[1];
      pdfBuffer = Buffer.from(pdfBase64, 'base64');
      console.log('🧾 PDF đã tạo xong, kích thước (bytes):', pdfBuffer.length);
    } catch (e) {
      pdfError = e;
      console.error('❌ Lỗi khi tạo PDF:', e?.message || e);
    }

    // Email content
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: order.customer?.email,
      subject: `Hóa đơn đơn hàng #${order.orderNumber || order._id} - BONSAI SHOP`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #22c55e; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">BONSAI SHOP</h1>
            <p style="margin: 10px 0 0 0;">Cảm ơn quý khách đã mua hàng!</p>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #22c55e;">Thông tin đơn hàng</h2>
            <p><strong>Mã đơn hàng:</strong> ${order.orderNumber || order._id}</p>
            <p><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
            <p><strong>Trạng thái:</strong> ${getStatusText(order.status)}</p>
            <p><strong>Tổng tiền:</strong> ${order.total?.toLocaleString()} VND</p>
          </div>
          
          <div style="padding: 20px;">
            <h3 style="color: #22c55e;">Chi tiết sản phẩm</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #22c55e; color: white;">
                  <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">STT</th>
                  <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Sản phẩm</th>
                  <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">SL</th>
                  <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Đơn giá</th>
                  <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map((item, index) => `
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${index + 1}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                    <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.price?.toLocaleString()} VND</td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${(item.price * item.quantity)?.toLocaleString()} VND</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div style="text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; color: #22c55e;">
              Tổng cộng: ${order.total?.toLocaleString()} VND
            </div>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center;">
            <p style="margin: 0; color: #666;">Hóa đơn PDF được đính kèm bên dưới</p>
            <p style="margin: 10px 0 0 0; color: #666;">Hẹn gặp lại quý khách!</p>
          </div>
        </div>
      `,
      attachments: pdfBuffer ? [
        {
          filename: `hoa-don-${order.orderNumber || order._id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ] : []
    };

    // Gửi email
    console.log('📤 Đang gửi email...');
    console.log('📤 Mail options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasAttachments: mailOptions.attachments?.length > 0,
      pdfError: pdfError ? (pdfError?.message || String(pdfError)) : null
    });
    
    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Email đã gửi thành công:', result.messageId);

      return res.json({ 
        success: true, 
        message: 'Hóa đơn đã được gửi qua email thành công!',
        messageId: result.messageId
      });
    } catch (sendErr) {
      console.error('❌ Gửi email thất bại, nhưng không chặn đơn hàng:', sendErr?.message || sendErr);
      // Trả về 200 để frontend không xem là lỗi nghiêm trọng
      return res.json({
        success: false,
        message: 'Không gửi được email hóa đơn, nhưng đơn hàng vẫn được tạo.'
      });
    }

  } catch (error) {
    console.error('❌ Lỗi tổng khi xử lý gửi email:', error);
    // Luôn trả 200 để không chặn checkout
    return res.json({
      success: false,
      message: 'Gặp lỗi khi tạo/gửi hóa đơn qua email. Đơn hàng vẫn hợp lệ.'
    });
  }
};

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Chờ xác nhận',
    'confirmed': 'Đã xác nhận',
    'shipping': 'Đang giao',
    'delivered': 'Đã giao',
    'cancelled': 'Đã huỷ'
  };
  return statusMap[status] || status;
};
const getPaymentMethodText = (method) => {
  const methodMap = {
    'cod': 'Thanh toán khi nhận hàng',
    'momo': 'Ví MoMo',
    'vnpay': 'VNPay',
    'bank': 'Chuyển khoản ngân hàng'
  };
  return methodMap[method] || method || 'Thanh toán khi nhận hàng';
};

