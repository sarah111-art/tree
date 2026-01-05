import React from 'react';

const PaymentInfo = ({ type, qrInfo, dynamicQR, amount, customerName, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // Tạo QR code từ base64 string
  // QUAN TRỌNG: qrCode từ backend là Base64 PNG image, KHÔNG phải QR text string
  // Chỉ cần thêm prefix data:image/png;base64, và render như ảnh PNG
  // KHÔNG được encode lại hoặc tạo QR mới từ base64 này
  const createQRImage = (qrCodeString) => {
    if (!qrCodeString) return null;
    
    // Nếu đã có prefix data: thì trả về luôn
    if (qrCodeString.startsWith('data:')) {
      return qrCodeString;
    }
    
    // Nếu là QR text string (có chứa vnpay:// hoặc http://) thì không phải base64
    if (qrCodeString.includes('vnpay://') || qrCodeString.startsWith('http')) {
      return null; // Không phải base64 image
    }
    
    // Backend trả về base64 string thuần, thêm prefix để render như ảnh PNG
    return `data:image/png;base64,${qrCodeString}`;
  };

  // Tạo QR code từ QR string sử dụng external service
  const createQRFromString = (qrString) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrString)}`;
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
              {dynamicQR.momo.qrCode ? (
                <img
                  src={createQRImage(dynamicQR.momo.qrCode)}
                  alt="QR Momo"
                  className="w-48 h-48 object-contain rounded-lg border-2 border-pink-300"
                  onError={(e) => {
                    // Fallback to external QR service if base64 fails
                    if (dynamicQR.momo.qrString) {
                      e.target.src = createQRFromString(dynamicQR.momo.qrString);
                    }
                  }}
                />
              ) : dynamicQR.momo.qrString ? (
                <img
                  src={createQRFromString(dynamicQR.momo.qrString)}
                  alt="QR Momo"
                  className="w-48 h-48 object-contain rounded-lg border-2 border-pink-300"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-lg border-2 border-pink-300 flex items-center justify-center">
                  <p className="text-gray-500 text-sm text-center">QR không khả dụng</p>
                </div>
              )}
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
                  {dynamicQR.momo.qrString && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <p className="text-gray-600 mb-1">QR String:</p>
                      <p className="font-mono text-gray-800 break-all">{dynamicQR.momo.qrString}</p>
                    </div>
                  )}
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
              <p className="text-sm text-gray-700 mb-2">Quét mã QR để thanh toán:</p>
              <p className="text-xs text-gray-500 mb-3">
                📱 Quét bằng <strong>Camera điện thoại</strong> hoặc <strong>App VNPay</strong>
              </p>
              {dynamicQR.vnpay.qrCode ? (
                <img
                  src={createQRImage(dynamicQR.vnpay.qrCode)}
                  alt="QR VNPay - Quét bằng Camera điện thoại hoặc App VNPay"
                  className="w-64 h-64 object-contain rounded-lg border-2 border-blue-300 bg-white p-2"
                  onError={(e) => {
                    console.error('❌ Lỗi hiển thị QR code từ base64, fallback sang paymentUrl');
                    // Fallback: nếu base64 không load được, tạo QR từ paymentUrl
                    if (dynamicQR.vnpay.paymentUrl) {
                      e.target.src = createQRFromString(dynamicQR.vnpay.paymentUrl);
                    } else if (dynamicQR.vnpay.qrString && !dynamicQR.vnpay.qrString.startsWith('vnpay://')) {
                      e.target.src = createQRFromString(dynamicQR.vnpay.qrString);
                    }
                  }}
                />
              ) : dynamicQR.vnpay.paymentUrl ? (
                <img
                  src={createQRFromString(dynamicQR.vnpay.paymentUrl)}
                  alt="QR VNPay"
                  className="w-48 h-48 object-contain rounded-lg border-2 border-blue-300"
                />
              ) : dynamicQR.vnpay.qrString && !dynamicQR.vnpay.qrString.startsWith('vnpay://') ? (
                <img
                  src={createQRFromString(dynamicQR.vnpay.qrString)}
                  alt="QR VNPay"
                  className="w-48 h-48 object-contain rounded-lg border-2 border-blue-300"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-lg border-2 border-blue-300 flex items-center justify-center">
                  <p className="text-gray-500 text-sm text-center">QR không khả dụng</p>
                </div>
              )}
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
                  {dynamicQR.vnpay.qrString && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <p className="text-gray-600 mb-1">QR String:</p>
                      <p className="font-mono text-gray-800 break-all">{dynamicQR.vnpay.qrString}</p>
                    </div>
                  )}
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
              
              {/* Nút mở app VNPay nếu có deep link */}
              {dynamicQR.vnpay.deepLink && (
                <div className="mt-3">
                  <a
                    href={dynamicQR.vnpay.deepLink}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    onClick={(e) => {
                      // Thử mở app, nếu không được thì mở paymentUrl
                      const opened = window.open(dynamicQR.vnpay.deepLink, '_blank');
                      if (!opened || opened.closed) {
                        e.preventDefault();
                        window.open(dynamicQR.vnpay.paymentUrl || dynamicQR.vnpay.qrString, '_blank');
                      }
                    }}
                  >
                    📱 Mở app VNPay để thanh toán
                  </a>
                </div>
              )}
              
              {/* Nút mở thanh toán trên web nếu không có deep link */}
              {!dynamicQR.vnpay.deepLink && dynamicQR.vnpay.paymentUrl && (
                <div className="mt-3">
                  <a
                    href={dynamicQR.vnpay.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                  >
                    🌐 Mở trang thanh toán VNPay
                  </a>
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
            <strong>💡 Hướng dẫn:</strong> Quét mã QR bằng <strong>Camera điện thoại</strong> hoặc <strong>App VNPay</strong> → Kiểm tra thông tin → Xác nhận thanh toán
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
        
        {qrInfo?.bank ? (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border">
              <p className="text-sm font-medium text-gray-600 mb-3">Thông tin chuyển khoản:</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngân hàng:</span>
                  <span className="font-medium">{qrInfo.bank.bankName || 'Vietcombank'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tài khoản:</span>
                  <span className="font-medium">{qrInfo.bank.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tên tài khoản:</span>
                  <span className="font-medium">{qrInfo.bank.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-bold text-purple-600">{formatCurrency(amount)} đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nội dung:</span>
                  <span className="font-medium">Thanh toan don hang {customerName}</span>
                </div>
              </div>
            </div>
            
            {qrInfo.bank.imageUrl && (
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2">Quét mã QR để chuyển tiền:</p>
                <img
                  src={qrInfo.bank.imageUrl}
                  alt="QR Bank"
                  className="w-48 h-48 object-contain rounded-lg border-2 border-purple-300 mx-auto"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-gray-500">Thông tin chuyển khoản chưa có sẵn</p>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>💡 Hướng dẫn:</strong> Chuyển khoản theo thông tin trên → Gửi biên lai cho chúng tôi
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentInfo;
