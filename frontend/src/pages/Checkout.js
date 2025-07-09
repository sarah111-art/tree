import React, { useEffect, useState } from 'react';
import axios from '../api';
import { backendUrl, useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, setCartItems, user } = useShop();
  const [qrImages, setQrImages] = useState({});
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const order = {
      customer: form,
      items: cartItems,
      total: totalAmount,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axios.post(
        `${backendUrl}/api/orders`,
        order
      );

      alert('✅ Đặt hàng thành công!');
      setCartItems([]);
      localStorage.removeItem('cart');
    } catch (err) {
      console.error('❌ Lỗi đặt hàng:', err);
      alert('❌ Đặt hàng thất bại!');
    }
  };

  // ✅ Load QR bằng axios
  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/qr`);
        const qrMap = {};
        res.data.forEach((qr) => {
          qrMap[qr.type] = qr.imageUrl;
        });
        setQrImages(qrMap);
      } catch (err) {
        console.error('❌ Lỗi lấy mã QR:', err);
      }
    };
    fetchQR();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">🛒 Thanh toán</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">
          Không có sản phẩm trong giỏ hàng.
          <Link to="/san-pham" className="text-green-600 hover:underline ml-2">
            Tiếp tục mua sắm
          </Link>
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Danh sách sản phẩm */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-3">Sản phẩm</h3>
            <ul className="space-y-3">
              {cartItems.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toLocaleString()} đ</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 font-bold text-right text-lg">
              Tổng cộng: {totalAmount.toLocaleString()} đ
            </div>
          </div>

          {/* Form thanh toán */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow space-y-4"
          >
            <h3 className="text-lg font-semibold">Thông tin giao hàng</h3>
            <input
              type="text"
              name="name"
              placeholder="Họ tên"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            <textarea
              name="address"
              placeholder="Địa chỉ nhận hàng"
              value={form.address}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              rows={3}
            ></textarea>

            <div>
              <label className="block font-medium mb-1">
                Phương thức thanh toán:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="cod">💵 Thanh toán khi nhận hàng (COD)</option>
                <option value="momo">📱 Ví Momo</option>
                <option value="bank">🏦 Chuyển khoản ngân hàng</option>
              </select>
            </div>

            {/* QR Momo */}
            {paymentMethod === 'momo' && qrImages.momo && (
              <div className="bg-pink-50 p-3 rounded">
                <p>Quét mã để chuyển tiền qua Momo:</p>
                <img
                  src={qrImages.momo}
                  alt="QR Momo"
                  className="w-52 mt-2 rounded border"
                />
                <p className="mt-1 text-sm">
                  Số tiền: <strong>{totalAmount.toLocaleString()} đ</strong>
                </p>
              </div>
            )}

            {/* QR Bank */}
            {paymentMethod === 'bank' && qrImages.bank && (
              <div className="bg-blue-50 p-3 rounded text-sm">
                <p>Chuyển khoản ngân hàng theo thông tin sau:</p>
                <ul className="mt-2 space-y-1">
                  <li><strong>Ngân hàng:</strong> Vietcombank</li>
                  <li><strong>Số tài khoản:</strong> 0123456789</li>
                  <li><strong>Chủ tài khoản:</strong> NGUYEN VAN A</li>
                  <li><strong>Nội dung:</strong> {form.name} - Đặt Bonsai</li>
                </ul>
                <div className="mt-2">
                  <img
                    src={qrImages.bank}
                    alt="QR Ngân hàng"
                    className="w-52 rounded border"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Xác nhận đặt hàng
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Checkout;
