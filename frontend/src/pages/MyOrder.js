import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useShop } from '../context/ShopContext';
import { backendUrl } from '../context/ShopContext';

export default function MyOrders() {
  const { user } = useShop();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  console.log('🔍 MyOrder - User:', user);
  if (user?.email) {
    console.log('📧 Tìm đơn hàng cho email:', user.email);
    axios.get(`${backendUrl}/api/orders/user/${user.email}`)
      .then(res => {
        console.log('📦 Kết quả đơn hàng:', res.data);
        setOrders(res.data);
      })
      .catch(err => {
        console.error('❌ Lỗi lấy đơn:', err);
        setOrders([]);
      });
  } else {
    console.warn('⚠️ Không có user.email');
    setOrders([]);
  }
}, [user]);

  const debugDatabase = async () => {
    try {
      console.log('🔍 Debug - Kiểm tra database...');
      const res = await axios.get(`${backendUrl}/api/orders/debug/all`);
      console.log('📋 Debug - Kết quả database:', res.data);
      alert(`Tổng đơn hàng: ${res.data.total}\nKiểm tra console để xem chi tiết`);
    } catch (err) {
      console.error('❌ Debug - Lỗi:', err);
      alert('Lỗi khi debug database');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">🧾 Đơn hàng của bạn</h2>
        <button 
          onClick={debugDatabase}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🔍 Debug DB
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào.</p>
          <p className="text-sm text-gray-500">User email: {user?.email}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow bg-white">
              <p><strong>Ngày:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Trạng thái:</strong> {order.status}</p>
              <p><strong>Tổng cộng:</strong> {order.total.toLocaleString()} đ</p>
              <p><strong>Email:</strong> {order.customer?.email}</p>
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
