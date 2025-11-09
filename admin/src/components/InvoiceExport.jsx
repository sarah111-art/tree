import React from 'react';
import jsPDF from 'jspdf';

const InvoiceExport = ({ order, onClose }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94); // Green color
    doc.text('HÓA ĐƠN BÁN HÀNG', 105, 25, { align: 'center' });
    
    // Reset color
    doc.setTextColor(0, 0, 0);
    
    // Company info
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94); // Green color
    doc.text('CÒI GARDEN', 20, 45);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM', 20, 55);
    doc.text('Điện thoại: 0123 456 789', 20, 60);
    doc.text('Email: info@coigarden.com', 20, 65);
    
    // Invoice info
    doc.setFontSize(11);
    doc.text(`Mã hóa đơn: ${order.orderNumber || order._id}`, 120, 45);
    doc.text(`Ngày: ${new Date(order.createdAt).toLocaleDateString('vi-VN')}`, 120, 55);
    doc.text(`Trạng thái: ${getStatusText(order.status)}`, 120, 65);
    
    // Customer info
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94); // Green color
    doc.text('THÔNG TIN KHÁCH HÀNG', 20, 85);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tên: ${order.customer?.name || 'N/A'}`, 20, 95);
    doc.text(`SĐT: ${order.customer?.phone || 'N/A'}`, 20, 100);
    doc.text(`Địa chỉ: ${order.customer?.address || 'N/A'}`, 20, 105);
    doc.text(`Email: ${order.customer?.email || 'N/A'}`, 20, 110);
    
    // Payment info
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94); // Green color
    doc.text('THÔNG TIN THANH TOÁN', 20, 130);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Phương thức: ${getPaymentMethodText(order.paymentMethod)}`, 20, 140);
    
    // Items header
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94); // Green color
    doc.text('CHI TIẾT SẢN PHẨM', 20, 160);
    
    // Items table header
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('STT', 20, 175);
    doc.text('Sản phẩm', 35, 175);
    doc.text('SL', 120, 175);
    doc.text('Đơn giá', 140, 175);
    doc.text('Thành tiền', 170, 175);
    
    // Draw table lines
    doc.setDrawColor(34, 197, 94); // Green color
    doc.line(20, 180, 190, 180); // Header line
    
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
    doc.setDrawColor(34, 197, 94); // Green color
    doc.line(20, yPosition + 5, 190, yPosition + 5);
    
    // Total
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94); // Green color
    doc.text(`Tổng cộng: ${order.total?.toLocaleString()} VND`, 150, yPosition + 15);
    
    // Footer
    doc.setFontSize(12);
    doc.setTextColor(128, 128, 128); // Gray color
    doc.text('Cảm ơn quý khách đã mua hàng!', 105, yPosition + 30, { align: 'center' });
    doc.text('Hẹn gặp lại quý khách!', 105, yPosition + 35, { align: 'center' });
    
    // Save PDF
    doc.save(`hoa-don-${order.orderNumber || order._id}.pdf`);
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'shipping': 'Đang giao',
      'delivered': 'Đã giao',
      'cancelled': 'Đã hủy'
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">📄 Xuất hóa đơn</h3>
        
        <div className="space-y-3 mb-6">
          <div>
            <span className="font-medium">Mã đơn hàng:</span>
            <span className="ml-2 text-gray-600">{order.orderNumber || order._id}</span>
          </div>
          <div>
            <span className="font-medium">Khách hàng:</span>
            <span className="ml-2 text-gray-600">{order.customer?.name}</span>
          </div>
          <div>
            <span className="font-medium">Tổng tiền:</span>
            <span className="ml-2 text-green-600 font-bold">
              {order.total?.toLocaleString()} ₫
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={generatePDF}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            📄 Xuất PDF
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            ❌ Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceExport;
