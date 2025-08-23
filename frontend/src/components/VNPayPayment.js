import React, { useState } from 'react';
import axios from 'axios';

const VNPayPayment = ({ amount, orderId, orderInfo, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  const createVNPayPayment = async () => {
    try {
      setLoading(true);
      
      const paymentData = {
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo || `Thanh toán đơn hàng ${orderId}`,
        redirectUrl: `${window.location.origin}/payment-success`
      };

      const response = await axios.post('http://localhost:5001/api/vnpay/create-payment', paymentData);
      
      if (response.data.resultCode === 0) {
        setPaymentUrl(response.data.payUrl);
        // Tự động chuyển hướng đến trang thanh toán VNPay
        window.location.href = response.data.payUrl;
      } else {
        throw new Error(response.data.message || 'Lỗi tạo thanh toán');
      }
    } catch (error) {
      console.error('VNPay payment error:', error);
      if (onError) {
        onError(error.response?.data?.message || 'Lỗi thanh toán VNPay');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">🏦</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Thanh toán qua VNPay
        </h3>
        <p className="text-gray-600 text-sm">
          Chuyển hướng đến cổng thanh toán VNPay
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Số tiền:</span>
          <span className="font-semibold text-lg text-blue-600">
            {formatCurrency(amount)}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Mã đơn hàng:</span>
          <span className="font-medium">{orderId}</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="text-blue-600 mr-2">ℹ️</div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Thông tin thanh toán:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Bạn sẽ được chuyển hướng đến trang thanh toán VNPay</li>
              <li>Thanh toán an toàn qua cổng thanh toán chính thức</li>
              <li>Hỗ trợ tất cả các ngân hàng nội địa</li>
              <li>Nhận thông báo kết quả ngay sau khi hoàn tất</li>
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={createVNPayPayment}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Đang xử lý...
          </div>
        ) : (
          'Thanh toán ngay'
        )}
      </button>

      {paymentUrl && (
        <div className="mt-4 text-center">
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Mở trang thanh toán trong tab mới
          </a>
        </div>
      )}
    </div>
  );
};

export default VNPayPayment;
