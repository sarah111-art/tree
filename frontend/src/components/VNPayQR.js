import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VNPayQR = ({ onPaymentSuccess }) => {
  const [vnpayQR, setVnpayQR] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVNPayQR();
  }, []);

  const fetchVNPayQR = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/qr/vnpay');
      setVnpayQR(response.data);
    } catch (err) {
      setError('Không thể tải QR VNPay');
      console.error('Error fetching VNPay QR:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Đang tải QR VNPay...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <button 
          onClick={fetchVNPayQR}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!vnpayQR) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-500">Không có QR VNPay</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Thanh toán qua VNPay
        </h3>
        <p className="text-gray-600 text-sm">
          Quét mã QR bên dưới để thanh toán
        </p>
      </div>

      <div className="text-center mb-6">
        <img 
          src={vnpayQR.imageUrl} 
          alt="VNPay QR Code" 
          className="mx-auto w-48 h-48 object-contain border border-gray-200 rounded-lg"
        />
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Mã ngân hàng:</span>
          <span className="font-medium">{vnpayQR.bankCode}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số tài khoản:</span>
          <span className="font-medium">{vnpayQR.accountNumber}</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <div className="text-blue-600 mr-2">💡</div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Hướng dẫn thanh toán:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Mở ứng dụng ngân hàng</li>
              <li>Chọn "Quét mã" hoặc "Scan QR"</li>
              <li>Quét mã QR bên trên</li>
              <li>Kiểm tra thông tin và xác nhận</li>
              <li>Nhập OTP để hoàn tất</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handlePaymentSuccess}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Đã thanh toán xong
        </button>
      </div>
    </div>
  );
};

export default VNPayQR;
