import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MomoQR = ({ onPaymentSuccess }) => {
  const [momoQR, setMomoQR] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMomoQR();
  }, []);

  const fetchMomoQR = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/qr/momo');
      setMomoQR(response.data);
    } catch (err) {
      setError('Không thể tải QR Momo');
      console.error('Error fetching Momo QR:', err);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2">Đang tải QR Momo...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <button 
          onClick={fetchMomoQR}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!momoQR) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-500">Không có QR Momo</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Thanh toán qua Momo
        </h3>
        <p className="text-gray-600 text-sm">
          Quét mã QR bên dưới để thanh toán
        </p>
      </div>

      <div className="text-center mb-6">
        <img 
          src={momoQR.imageUrl} 
          alt="Momo QR Code" 
          className="mx-auto w-48 h-48 object-contain border border-gray-200 rounded-lg"
        />
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số điện thoại:</span>
          <span className="font-medium">{momoQR.phoneNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tên tài khoản:</span>
          <span className="font-medium">{momoQR.accountName}</span>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <div className="text-yellow-600 mr-2">💡</div>
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Hướng dẫn thanh toán:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Mở ứng dụng Momo</li>
              <li>Chọn "Quét mã"</li>
              <li>Quét mã QR bên trên</li>
              <li>Nhập số tiền và nội dung</li>
              <li>Xác nhận thanh toán</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handlePaymentSuccess}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Đã thanh toán xong
        </button>
      </div>
    </div>
  );
};

export default MomoQR;
