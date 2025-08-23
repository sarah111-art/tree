import React from 'react';

const PaymentInfo = ({ type, qrInfo, dynamicQR, amount, customerName, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // Tạo QR code từ base64 string
  const createQRImage = (qrCodeString) => {
    return `data:image/png;base64,${qrCodeString}`;
  };

  if (type === 'momo') {
    return (
      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">📱</span>
          <h4 className="font-semibold text-pink-800">Thanh toán qua Momo</h4>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mr-2"></div>
            <span className="text-pink-600">Đang tạo mã QR...</span>
          </div>
        ) : dynamicQR?.momo ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-700 mb-3">Quét mã QR để chuyển tiền:</p>
              <img
                src={createQRImage(dynamicQR.momo.qrCode)}
                alt="QR Momo"
                className="w-48 h-48 object-contain rounded-lg border-2 border-pink-300"
              />
            </div>
            
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border">
                <p className="text-sm font-medium text-gray-600 mb-2">Thông tin đơn hàng:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-medium">{dynamicQR.momo.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-bold text-pink-600">{formatCurrency(dynamicQR.momo.amount)} đ</span>
                  </div>
                </div>
              </div>
              
              {qrInfo?.momo && (
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm font-medium text-gray-600 mb-2">Thông tin tài khoản:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số điện thoại:</span>
                      <span className="font-medium">{qrInfo.momo.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tên tài khoản:</span>
                      <span className="font-medium">{qrInfo.momo.accountName}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-gray-500">Vui lòng chọn phương thức thanh toán để tạo mã QR</p>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>💡 Hướng dẫn:</strong> Mở app Momo → Quét mã → Kiểm tra thông tin → Xác nhận thanh toán
          </p>
        </div>
      </div>
    );
  }

  if (type === 'vnpay') {
    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">🏦</span>
          <h4 className="font-semibold text-blue-800">Thanh toán qua VNPay</h4>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-blue-600">Đang tạo mã QR...</span>
          </div>
        ) : dynamicQR?.vnpay ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-700 mb-3">Quét mã QR để chuyển tiền:</p>
              <img
                src={createQRImage(dynamicQR.vnpay.qrCode)}
                alt="QR VNPay"
                className="w-48 h-48 object-contain rounded-lg border-2 border-blue-300"
              />
            </div>
            
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border">
                <p className="text-sm font-medium text-gray-600 mb-2">Thông tin đơn hàng:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-medium">{dynamicQR.vnpay.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-bold text-blue-600">{formatCurrency(dynamicQR.vnpay.amount)} đ</span>
                  </div>
                </div>
              </div>
              
              {qrInfo?.vnpay && (
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm font-medium text-gray-600 mb-2">Thông tin tài khoản:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã ngân hàng:</span>
                      <span className="font-medium">{qrInfo.vnpay.bankCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tài khoản:</span>
                      <span className="font-medium">{qrInfo.vnpay.accountNumber}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-gray-500">Vui lòng chọn phương thức thanh toán để tạo mã QR</p>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>💡 Hướng dẫn:</strong> Mở app ngân hàng → Quét mã → Kiểm tra thông tin → Xác nhận thanh toán
          </p>
        </div>
      </div>
    );
  }

  if (type === 'bank') {
    return (
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">🏦</span>
          <h4 className="font-semibold text-purple-800">Chuyển khoản ngân hàng</h4>
        </div>
        
        <div className="bg-white p-4 rounded border">
          <p className="text-sm font-medium text-gray-600 mb-3">Thông tin tài khoản:</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ngân hàng:</span>
              <span className="font-medium">Vietcombank</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Số tài khoản:</span>
              <span className="font-medium">0123456789</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chủ tài khoản:</span>
              <span className="font-medium">CTY TNHH BONSAI VIET</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nội dung:</span>
              <span className="font-medium">{customerName} - Bonsai</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Số tiền:</span>
              <span className="font-bold text-purple-600">{formatCurrency(amount)} đ</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>💡 Lưu ý:</strong> Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh chóng
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentInfo;
