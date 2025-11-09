import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import PaymentInfo from '../components/PaymentInfo';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import { useNavigate } from 'react-router-dom';
const Checkout = () => {
  const { cartItems, setCartItems, user } = useShop();
  const [qrImages, setQrImages] = useState({});
  const [qrInfo, setQrInfo] = useState({});
  const [dynamicQR, setDynamicQR] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
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

  // ✅ Tạo QR code động cho đơn hàng
  const createDynamicQR = async (method) => {
    if (method === 'cod') return;
    
    setLoading(true);
    try {
      const orderId = `ORDER_${Date.now()}`;
      const orderInfo = `Thanh toan don hang ${orderId}`;
      
      if (method === 'momo') {
        // Tạo QR Momo động
        const response = await axios.post(`${backendUrl}/api/momo/create-qr`, {
          amount: totalAmount,
          orderId: orderId,
          orderInfo: orderInfo
        });
        
        if (response.data.resultCode === 0) {
          setDynamicQR(prev => ({
            ...prev,
            momo: {
              qrCode: response.data.qrCode,
              orderId: orderId,
              amount: totalAmount
            }
          }));
        }
      } else if (method === 'vnpay') {
        // Tạo QR VNPay động
        const response = await axios.post(`${backendUrl}/api/vnpay/create-qr`, {
          amount: totalAmount,
          orderId: orderId,
          orderInfo: orderInfo
        });
        
        if (response.data.resultCode === 0) {
          setDynamicQR(prev => ({
            ...prev,
            vnpay: {
              qrCode: response.data.qrCode,
              orderId: orderId,
              amount: totalAmount
            }
          }));
        }
      }
    } catch (error) {
      console.error('❌ Lỗi tạo QR động:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Xử lý thay đổi phương thức thanh toán
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method !== 'cod' && method !== 'bank') {
      createDynamicQR(method);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.email || !form.address) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('Vui lòng nhập email hợp lệ!');
      return;
    }

    const order = {
      customer: {
        ...form,
        email: form.email // Sử dụng email từ form
      },
      items: cartItems,
      total: totalAmount,
      paymentMethod,
      orderId: dynamicQR[paymentMethod]?.orderId || `ORDER_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    try {
      console.log('📦 Đang tạo đơn hàng:', order);
      const res = await axios.post(
        `${backendUrl}/api/orders`,
        order
      );
      console.log('✅ Đơn hàng đã tạo:', res.data);

      // Gửi email hóa đơn cho khách hàng (gửi kèm cả dạng phẳng và dạng legacy {order})
      try {
        const emailPayload = {
          orderId: res.data?._id || order.orderId,
          customerEmail: form.email,
          customerName: form.name,
          orderDetails: {
            items: cartItems,
            total: totalAmount,
            paymentMethod,
            orderDate: new Date().toISOString(),
            shippingAddress: form.address,
            phone: form.phone,
          },
          // Legacy compatibility
          order: {
            _id: res.data?._id || order.orderId,
            orderNumber: res.data?.orderNumber || undefined,
            createdAt: new Date().toISOString(),
            total: totalAmount,
            paymentMethod,
            items: cartItems,
            customer: {
              name: form.name,
              email: form.email,
              phone: form.phone,
              address: form.address,
            },
          },
        };

        await axios.post(`${backendUrl}/api/email/send-invoice`, emailPayload);
        console.log('✅ Email hóa đơn đã được gửi');
      } catch (emailError) {
        console.error('❌ Lỗi gửi email hóa đơn:', emailError);
        // Không block luồng chính nếu gửi email thất bại
      }

      if (user) {
        alert('✅ Đặt hàng thành công! Hóa đơn đã được gửi về email của bạn.');
        setTimeout(() => {
          navigate('/don-hang');
        }, 2000);
      } else {
        alert('✅ Đặt hàng thành công! Hóa đơn đã được gửi về email của bạn. Vui lòng đăng nhập để xem chi tiết đơn hàng.');
        setTimeout(() => {
          navigate('/dang-nhap');
        }, 2000);
      }
      setCartItems([]);
      localStorage.removeItem('cart');
      setDynamicQR({});
    } catch (err) {
      console.error('❌ Lỗi đặt hàng:', err);
      alert('❌ Đặt hàng thất bại!');
    }
  };

  // ✅ Load QR tĩnh ()
  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/qr`);
        const qrMap = {};
        const qrInfoMap = {};
        
        res.data.forEach((qr) => {
          qrMap[qr.type] = qr.imageUrl;
          qrInfoMap[qr.type] = {
            imageUrl: qr.imageUrl,
            phoneNumber: qr.phoneNumber,
            accountName: qr.accountName,
            bankCode: qr.bankCode,
            accountNumber: qr.accountNumber
          };
        });
        
        setQrImages(qrMap);
        setQrInfo(qrInfoMap);
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
            
            {/* Thông báo cho khách chưa đăng nhập */}
            {!user && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 text-xl">ℹ️</span>
                  <div>
                    <p className="text-blue-800 font-medium">Bạn có thể đặt hàng mà không cần đăng nhập</p>
                    <p className="text-blue-700 text-sm mt-1">Đăng nhập để xem chi tiết đơn hàng và theo dõi trạng thái</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Link 
                    to="/dang-nhap" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Đăng nhập ngay
                  </Link>
                </div>
              </div>
            )}
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
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
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

            {/* Chọn phương thức thanh toán */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={handlePaymentMethodChange}
            />

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-center justify-center p-4 bg-blue-50 rounded">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                <span className="text-blue-600">Đang tạo mã QR...</span>
              </div>
            )}

            {/* Hiển thị thông tin thanh toán */}
            <PaymentInfo
              type={paymentMethod}
              qrInfo={qrInfo}
              dynamicQR={dynamicQR}
              amount={totalAmount}
              customerName={form.name}
              loading={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded font-medium ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Checkout;
