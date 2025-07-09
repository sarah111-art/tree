import React, { useEffect, useState } from 'react';
import api from '../../api';
import { backendUrl } from '../../App';

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    api.get(`${backendUrl}/api/orders`)
      .then(res => setOrders(res.data))
      .catch(err => console.error('Lỗi tải đơn hàng:', err));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`${backendUrl}/api/orders/${id}/status`, { status });
      setOrders(orders.map(order => order._id === id ? res.data : order));
    } catch (err) {
      alert('❌ Lỗi cập nhật trạng thái!');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📦 Quản lý đơn hàng</h2>

      {/* Modal hiển thị chi tiết */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">🧾 Chi tiết đơn hàng</h3>
            <p><strong>Khách:</strong> {selectedOrder.customer.name}</p>
            <p><strong>SĐT:</strong> {selectedOrder.customer.phone}</p>
            <p><strong>Địa chỉ:</strong> {selectedOrder.customer.address}</p>
            <p><strong>Thanh toán:</strong> {selectedOrder.paymentMethod || 'COD'}</p>
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
            <button onClick={() => setSelectedOrder(null)} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Đóng</button>
          </div>
        </div>
      )}

      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th>Khách hàng</th>
            <th>SDT</th>
            <th>Tổng</th>
            <th>Thanh toán</th>
            <th>Trạng thái</th>
            <th>Ngày</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} className="border-t text-center">
              <td>{order.customer.name}</td>
              <td>{order.customer.phone}</td>
              <td>{order.total.toLocaleString()} đ</td>
              <td>{order.paymentMethod || 'COD'}</td>
              <td>
                <select
                  value={order.status}
                  onChange={e => handleStatusChange(order._id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã huỷ</option>
                </select>
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setSelectedOrder(order)}
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
