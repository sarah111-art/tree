import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { TableLoading } from '../../components/Loading';
import InvoiceExport from '../../components/InvoiceExport';
import OrderExport from '../../components/OrderExport';

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [exportOrder, setExportOrder] = useState(null);
  const [showOrderExport, setShowOrderExport] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${backendUrl}/api/orders`)
      .then(res => setOrders(res.data))
      .catch(err => console.error('Lỗi tải đơn hàng:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await axios.put(`${backendUrl}/api/orders/${id}/status`, { status });
      setOrders(orders.map(order => order._id === id ? res.data : order));
    } catch (err) {
      alert('❌ Lỗi cập nhật trạng thái!');
    }
  };

  const handleResendEmail = async (order) => {
    try {
      const res = await axios.post(`${backendUrl}/api/email/send-invoice`, { order });
      if (res.data.success) {
        alert('✅ Email hóa đơn đã được gửi lại thành công!');
      } else {
        alert('❌ Lỗi gửi email: ' + res.data.message);
      }
    } catch (err) {
      alert('❌ Lỗi gửi email: ' + err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📦 Quản lý đơn hàng</h2>
        <button
          onClick={() => setShowOrderExport(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          📊 Xuất Excel
        </button>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
          <div className="text-sm text-gray-600">Tổng đơn hàng</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
          <div className="text-sm text-gray-600">Đã giao</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Chờ xác nhận</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">
            {orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()} ₫
          </div>
          <div className="text-sm text-gray-600">Tổng doanh thu</div>
        </div>
      </div>

      {/* Modal xuất hóa đơn */}
      {exportOrder && (
        <InvoiceExport 
          order={exportOrder} 
          onClose={() => setExportOrder(null)} 
        />
      )}

      {/* Modal xuất danh sách đơn hàng */}
      {showOrderExport && (
        <OrderExport 
          orders={orders} 
          onClose={() => setShowOrderExport(false)} 
        />
      )}

      {/* Modal hiển thị chi tiết */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">🧾 Chi tiết đơn hàng</h3>
            <p><strong>Khách:</strong> {selectedOrder.customer.name}</p>
            <p><strong>SĐT:</strong> {selectedOrder.customer.phone}</p>
            <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
            <p><strong>Địa chỉ:</strong> {selectedOrder.customer.address}</p>
            <p><strong>Thanh toán:</strong> {
              (() => {
                const method = selectedOrder.paymentMethod || 'cod';
                const methodLabels = {
                  'cod': '💵 COD (Thanh toán khi nhận hàng)',
                  'momo': '📱 Momo',
                  'bank': '🏦 Chuyển khoản ngân hàng',
                  'vnpay': '🏦 VNPay'
                };
                return methodLabels[method] || method.toUpperCase();
              })()
            }</p>
            <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
            <hr className="my-2" />
            <ul className="space-y-1 text-sm">
              {selectedOrder.items.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{(item.price * item.quantity).toLocaleString()} đ</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 font-bold text-right text-green-700">
              Tổng: {selectedOrder.total.toLocaleString()} đ
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => {
                  setExportOrder(selectedOrder);
                  setSelectedOrder(null);
                }} 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                📄 Xuất hóa đơn
              </button>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <TableLoading />
      ) : (
        <table className="w-full border border-gray-300 text-sm rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Khách hàng</th>
              <th className="px-4 py-3 text-left font-semibold">SDT</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-right font-semibold">Tổng</th>
              <th className="px-4 py-3 text-center font-semibold">Thanh toán</th>
              <th className="px-4 py-3 text-center font-semibold">Trạng thái</th>
              <th className="px-4 py-3 text-center font-semibold">Ngày</th>
              <th className="px-4 py-3 text-center font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-3 text-left">{order.customer.name}</td>
                <td className="px-4 py-3 text-left">{order.customer.phone}</td>
                <td className="px-4 py-3 text-left">{order.customer.email}</td>
                <td className="px-4 py-3 text-right font-medium">{order.total.toLocaleString()} đ</td>
                <td className="px-4 py-3 text-center">
                  {(() => {
                    const method = order.paymentMethod || 'cod';
                    const methodLabels = {
                      'cod': '💵 COD',
                      'momo': '📱 Momo',
                      'bank': '🏦 Chuyển khoản',
                      'vnpay': '🏦 VNPay'
                    };
                    return methodLabels[method] || method.toUpperCase();
                  })()}
                </td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    className="border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="shipping">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã huỷ</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-3 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium px-2 py-1 rounded transition-colors"
                      onClick={() => setSelectedOrder(order)}
                    >
                      👁️ Chi tiết
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800 hover:underline text-sm font-medium px-2 py-1 rounded transition-colors"
                      onClick={() => setExportOrder(order)}
                    >
                      📄 Xuất
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium px-2 py-1 rounded transition-colors"
                      onClick={() => handleResendEmail(order)}
                    >
                      📧 Gửi lại
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
