import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentQR = ({ orderID, amount, onPaymentSuccess, backendUrl }) => {
  const [qrData, setQrData] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);

  // Tạo QR thanh toán
  useEffect(() => {
    const createQR = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${backendUrl}/api/casso/create-qr`, {
          orderId: orderID,
          amount: amount,
          description: "Thanh toan don hang"
        });

        if (response.data.success) {
          setQrData(response.data);
        } else {
          setError('Không thể tạo QR thanh toán');
        }
      } catch (err) {
        console.error('Lỗi tạo QR:', err);
        setError(err.response?.data?.message || 'Lỗi tạo QR thanh toán');
      } finally {
        setLoading(false);
      }
    };

    createQR();
  }, [orderID, amount, backendUrl]);

  // Check trạng thái thanh toán
  useEffect(() => {
    if (!qrData || isPaid) return;

    const checkPayment = async () => {
      try {
        setCheckingPayment(true);
        const response = await axios.get(`${backendUrl}/api/casso/check-payment/${orderID}`);
        
        if (response.data.paid) {
          setIsPaid(true);
          if (onPaymentSuccess) {
            onPaymentSuccess(response.data);
          }
        }
      } catch (err) {
        console.error('Lỗi check payment:', err);
      } finally {
        setCheckingPayment(false);
      }
    };

    // Check ngay lập tức
    checkPayment();

    // Check định kỳ mỗi 5 giây
    const interval = setInterval(checkPayment, 5000);

    return () => clearInterval(interval);
  }, [orderID, qrData, isPaid, onPaymentSuccess, backendUrl]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-2"></div>
        <span>Đang tạo QR thanh toán...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <div className="text-red-600 mb-2">❌ {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg">
        <div className="text-green-600 text-xl mb-2">✅ Thanh toán thành công!</div>
        <p className="text-gray-600">Cảm ơn bạn đã mua hàng</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Quét mã QR để thanh toán
        </h3>
        <p className="text-gray-600">
          Số tiền: <span className="font-bold text-green-600">{formatCurrency(amount)}</span>
        </p>
      </div>

      {qrData && (
        <>
          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <img
              src={qrData.qrImage}
              alt="QR Payment"
              className="w-48 h-48 object-contain border-2 border-gray-200 rounded-lg"
            />
          </div>

          {/* Thông tin chuyển khoản */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-gray-800 mb-3">Thông tin chuyển khoản:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ngân hàng:</span>
                <span className="font-medium">{qrData.transferInfo.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số tài khoản:</span>
                <span className="font-medium font-mono">{qrData.transferInfo.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tên chủ TK:</span>
                <span className="font-medium">{qrData.transferInfo.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-medium text-green-600">{formatCurrency(qrData.transferInfo.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nội dung:</span>
                <span className="font-medium font-mono text-xs">{qrData.transferInfo.content}</span>
              </div>
            </div>
          </div>

          {/* Hướng dẫn */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-blue-800 mb-2">📱 Hướng dẫn thanh toán:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Mở app ngân hàng trên điện thoại</li>
              <li>2. Chọn "Quét mã QR" hoặc "Chuyển khoản"</li>
              <li>3. Quét mã QR bên trên</li>
              <li>4. Kiểm tra thông tin và xác nhận thanh toán</li>
              <li>5. Đợi hệ thống tự động cập nhật trạng thái</li>
            </ol>
          </div>

          {/* Trạng thái */}
          <div className="text-center">
            {checkingPayment ? (
              <div className="flex items-center justify-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span>Đang kiểm tra thanh toán...</span>
              </div>
            ) : (
              <div className="text-gray-600">
                ⏳ Đang chờ thanh toán...
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentQR;
