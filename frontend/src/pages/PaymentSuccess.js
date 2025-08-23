import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    // Lấy thông tin từ URL params (Momo trả về)
    const resultCode = searchParams.get('resultCode');
    const orderId = searchParams.get('orderId');
    const message = searchParams.get('message');
    const transId = searchParams.get('transId');

    setPaymentInfo({
      resultCode,
      orderId,
      message,
      transId,
      isSuccess: resultCode === '0'
    });
  }, [searchParams]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (!paymentInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        {paymentInfo.isSuccess ? (
          // Thanh toán thành công
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Thanh toán thành công!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">{paymentInfo.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-medium">{paymentInfo.transId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="text-green-600 font-medium">Thành công</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/my-orders"
                className="block w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Xem đơn hàng của tôi
              </Link>
              
              <Link
                to="/"
                className="block w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        ) : (
          // Thanh toán thất bại
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">❌</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Thanh toán thất bại
            </h1>
            
            <p className="text-gray-600 mb-6">
              {paymentInfo.message || 'Có lỗi xảy ra trong quá trình thanh toán.'}
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">{paymentInfo.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã lỗi:</span>
                  <span className="font-medium">{paymentInfo.resultCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="text-red-600 font-medium">Thất bại</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/cart"
                className="block w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Thử lại thanh toán
              </Link>
              
              <Link
                to="/"
                className="block w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
