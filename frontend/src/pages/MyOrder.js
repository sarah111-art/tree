import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useShop } from '../context/ShopContext';
import { backendUrl } from '../context/ShopContext';

export default function MyOrders() {
  const { user } = useShop();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  if (user?.phone) {
    console.log('📞 Tìm đơn hàng cho số:', user.phone);
    axios.get(`${backendUrl}/api/orders/user/${user.phone}`)
      .then(res => {
        console.log('📦 Kết quả đơn hàng:', res.data);
        setOrders(res.data);
      })
      .catch(err => console.error('❌ Lỗi lấy đơn:', err));
  } else {
    console.warn('⚠️ Không có user.phone');
  }
}, [user]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🧾 Đơn hàng của bạn</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow bg-white">
              <p><strong>Ngày:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Trạng thái:</strong> {order.status}</p>
              <p><strong>Tổng cộng:</strong> {order.total.toLocaleString()} đ</p>
              <ul className="mt-2 ml-4 text-sm text-gray-700">
                {order.items.map((item) => (
                  <li key={item._id}>{item.name} x {item.quantity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
