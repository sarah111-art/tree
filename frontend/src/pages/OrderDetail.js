import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import axios from 'axios';
import { backendUrl } from '../context/ShopContext';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Phone,
  Calendar,
  Truck,
  User
} from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams();
  const { token, user } = useShop();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra đăng nhập
  useEffect(() => {
    if (!token || !user) {
      navigate('/dang-nhap', { state: { from: `/don-hang/${id}` } });
      return;
    }
  }, [token, user, navigate, id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrder(response.data);
      setError(null);
    } catch (err) {
      console.error('❌ Lỗi khi tải chi tiết đơn hàng:', err);
      setError('Không thể tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Load chi tiết đơn hàng
  useEffect(() => {
    if (token && user && id) {
      fetchOrderDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user, id]);

  // Hàm format ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Hàm format trạng thái
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          text: 'Chờ xác nhận',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: <Clock size={20} className="text-yellow-600" />
        };
      case 'confirmed':
        return {
          text: 'Đã xác nhận',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: <Package size={20} className="text-blue-600" />
        };
      case 'shipping':
        return {
          text: 'Đang giao hàng',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          icon: <Truck size={20} className="text-purple-600" />
        };
      case 'delivered':
        return {
          text: 'Đã giao hàng',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: <CheckCircle size={20} className="text-green-600" />
        };
      case 'cancelled':
        return {
          text: 'Đã hủy',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: <XCircle size={20} className="text-red-600" />
        };
      case 'paid':
        return {
          text: 'Đã thanh toán',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: <CheckCircle size={20} className="text-green-600" />
        };
      default:
        return {
          text: 'Không xác định',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: <Clock size={20} className="text-gray-600" />
        };
    }
  };

  // Hàm format phương thức thanh toán
  const getPaymentMethodInfo = (method) => {
    switch (method) {
      case 'cod':
        return { text: 'Thanh toán khi nhận hàng', icon: '💵' };
      case 'momo':
        return { text: 'Ví Momo', icon: '💖' };
      case 'vnpay':
        return { text: 'VNPay', icon: '💳' };
      case 'bank':
        return { text: 'Chuyển khoản ngân hàng', icon: '🏦' };
      default:
        return { text: 'Không xác định', icon: '❓' };
    }
  };

  if (!token || !user) {
    return null; // Sẽ redirect trong useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || 'Không tìm thấy đơn hàng'}</p>
          <div className="space-x-4">
            <button
              onClick={fetchOrderDetail}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Thử lại
            </button>
            <button
              onClick={() => navigate('/don-hang')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const paymentInfo = getPaymentMethodInfo(order.paymentMethod);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/don-hang')}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Đơn hàng #{order.orderId || order._id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-gray-600">Chi tiết đơn hàng</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${statusInfo.bgColor}`}>
                {statusInfo.icon}
              </div>
              <div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thông tin chính */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin đơn hàng */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin đơn hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                      <p className="font-medium text-gray-800">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  {order.paidAt && (
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">Ngày thanh toán</p>
                        <p className="font-medium text-gray-800">{formatDate(order.paidAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{paymentInfo.icon}</span>
                    <div>
                      <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                      <p className="font-medium text-gray-800">{paymentInfo.text}</p>
                    </div>
                  </div>
                  
                  {order.paymentId && (
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Mã giao dịch</p>
                        <p className="font-medium text-gray-800">{order.paymentId}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Sản phẩm đã đặt</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.image || item.images?.[0]?.url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Đơn giá: {item.price?.toLocaleString()} đ
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      <p className="font-semibold text-gray-800">
                        {(item.price * item.quantity).toLocaleString()} đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Tổng tiền */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-800">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {order.total?.toLocaleString()} đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Thông tin khách hàng */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin khách hàng</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User size={20} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Họ tên</p>
                    <p className="font-medium text-gray-800">{order.customer?.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium text-gray-800">{order.customer?.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                    <p className="font-medium text-gray-800">{order.customer?.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trạng thái đơn hàng */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Trạng thái đơn hàng</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${statusInfo.bgColor}`}>
                    {statusInfo.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{statusInfo.text}</p>
                    <p className="text-sm text-gray-500">
                      {order.status === 'pending' && 'Đơn hàng đang chờ xác nhận từ shop'}
                      {order.status === 'confirmed' && 'Đơn hàng đã được xác nhận'}
                      {order.status === 'shipping' && 'Đơn hàng đang được giao'}
                      {order.status === 'delivered' && 'Đơn hàng đã được giao thành công'}
                      {order.status === 'cancelled' && 'Đơn hàng đã bị hủy'}
                      {order.status === 'paid' && 'Đơn hàng đã được thanh toán'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hỗ trợ */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Cần hỗ trợ?</h2>
              <p className="text-green-100 mb-4">
                Nếu bạn có thắc mắc về đơn hàng, hãy liên hệ với chúng tôi
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone size={20} />
                  <span>039 868 9794</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>📧</span>
                  <span>support@coigarden.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
