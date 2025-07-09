// src/pages/CartPage.jsx
import React from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const {
    cartItems = [],
    removeFromCart,
    updateCartQuantity,
  } = useShop();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        🛒 Giỏ hàng của bạn
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Giỏ hàng đang trống.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách sản phẩm */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow"
              >
                <img
                  src={item.image || item.images?.[0]?.url}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-green-600">
                    {item.price.toLocaleString()} đ
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateCartQuantity(item._id, item.quantity - 1)
                      }
                      className="px-2 py-1 border rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateCartQuantity(item._id, item.quantity + 1)
                      }
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 ml-4 hover:underline text-sm flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Xoá
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng kết đơn hàng */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow space-y-4 h-fit">
            <h2 className="text-xl font-semibold">Tóm tắt đơn hàng</h2>
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính</span>
              <span>{total.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển</span>
              <span>30,000 đ</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span>{(total + 30000).toLocaleString()} đ</span>
            </div>
            <Link to="/dat-hang" className="block w-full text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
              Tiến hành đặt hàng
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
