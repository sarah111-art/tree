import React from 'react';
import * as XLSX from 'xlsx';

const OrderExport = ({ orders, onClose }) => {
  const exportToExcel = () => {
    // Chuẩn bị dữ liệu cho Excel
    const excelData = orders.map((order, index) => ({
      'STT': index + 1,
      'Mã đơn hàng': order.orderNumber || order._id,
      'Khách hàng': order.customer?.name || 'N/A',
      'SĐT': order.customer?.phone || 'N/A',
      'Email': order.customer?.email || 'N/A',
      'Địa chỉ': order.customer?.address || 'N/A',
      'Tổng tiền': order.total?.toLocaleString() + ' ₫',
      'Phương thức thanh toán': getPaymentMethodText(order.paymentMethod),
      'Trạng thái': getStatusText(order.status),
      'Ngày đặt': new Date(order.createdAt).toLocaleDateString('vi-VN'),
      'Sản phẩm': order.items?.map(item => `${item.name} (x${item.quantity})`).join(', ') || 'N/A'
    }));

    // Tạo workbook và worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Đơn hàng');

    // Điều chỉnh độ rộng cột
    ws['!cols'] = [
      { width: 5 },   // STT
      { width: 15 },  // Mã đơn hàng
      { width: 20 },  // Khách hàng
      { width: 15 },  // SĐT
      { width: 25 },  // Email
      { width: 30 },  // Địa chỉ
      { width: 15 },  // Tổng tiền
      { width: 20 },  // Phương thức thanh toán
      { width: 15 },  // Trạng thái
      { width: 15 },  // Ngày đặt
      { width: 50 }   // Sản phẩm
    ];

    // Xuất file
    XLSX.writeFile(wb, `danh-sach-don-hang-${new Date().toISOString().split('T')[0]}.xlsx`);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">📊 Xuất danh sách đơn hàng</h3>
        
        <div className="space-y-3 mb-6">
          <div>
            <span className="font-medium">Tổng số đơn hàng:</span>
            <span className="ml-2 text-blue-600 font-bold">{orders.length}</span>
          </div>
          <div>
            <span className="font-medium">Tổng doanh thu:</span>
            <span className="ml-2 text-green-600 font-bold">
              {orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()} ₫
            </span>
          </div>
          <div className="text-sm text-gray-600">
            File sẽ được tải về với định dạng Excel (.xlsx)
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            📊 Xuất Excel
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            ❌ Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderExport;
