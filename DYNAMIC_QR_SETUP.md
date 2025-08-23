# 🚀 Hướng dẫn thiết lập Dynamic QR Payment

## 📋 Tính năng mới

### ✅ QR Code Động
- **Mỗi đơn hàng** sẽ có QR code riêng với số tiền cụ thể
- **Tự động tạo** khi khách chọn phương thức thanh toán
- **Hiển thị thông tin** đơn hàng và số tiền chính xác
- **Bảo mật cao** với chữ ký và mã hóa

### 🎯 Phương thức thanh toán hỗ trợ
1. **📱 Momo QR** - QR code động với số tiền cụ thể
2. **🏦 VNPay QR** - QR code động với số tiền cụ thể  
3. **🏦 Bank Transfer** - Thông tin chuyển khoản thủ công
4. **💵 COD** - Thanh toán khi nhận hàng

## 🔧 Thiết lập Backend

### 1. Cài đặt dependencies
```bash
cd backend
npm install qrcode
```

### 2. Cập nhật .env
```env
# Momo Configuration
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
MOMO_IPN_URL=http://localhost:5001/api/momo/ipn

# VNPay Configuration
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5001/api/vnpay/callback
VNPAY_QR_URL=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Khởi động server
```bash
npm start
```

## 🧪 Test Backend

### Chạy test script
```bash
node scripts/testDynamicQR.js
```

### Test thủ công với curl
```bash
# Test tạo QR Momo động
curl -X POST http://localhost:5001/api/momo/create-qr \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "orderId": "TEST_ORDER_123",
    "orderInfo": "Thanh toán test sản phẩm"
  }'

# Test tạo QR VNPay động
curl -X POST http://localhost:5001/api/vnpay/create-qr \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 75000,
    "orderId": "TEST_ORDER_456",
    "orderInfo": "Thanh toán test sản phẩm"
  }'
```

## 🎨 Frontend Integration

### 1. Components đã tạo
- `PaymentMethodSelector.js` - Chọn phương thức thanh toán
- `PaymentInfo.js` - Hiển thị thông tin thanh toán
- `Checkout.js` - Trang thanh toán chính

### 2. Tính năng tự động
- **Tự động tạo QR** khi chọn Momo/VNPay
- **Loading indicator** trong quá trình tạo
- **Hiển thị thông tin** đơn hàng và số tiền
- **Responsive design** cho mobile

### 3. Khởi động frontend
```bash
cd frontend
npm start
```

## 📱 Cách hoạt động

### 1. Khách chọn sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Tính tổng tiền tự động

### 2. Chọn phương thức thanh toán
- Chọn **Momo** → Tự động tạo QR với số tiền cụ thể
- Chọn **VNPay** → Tự động tạo QR với số tiền cụ thể
- Chọn **Bank** → Hiển thị thông tin chuyển khoản
- Chọn **COD** → Không cần QR

### 3. Hiển thị thông tin
- **QR Code** với số tiền chính xác
- **Mã đơn hàng** để theo dõi
- **Thông tin tài khoản** (nếu có)
- **Hướng dẫn thanh toán**

### 4. Xử lý thanh toán
- Khách quét QR và thanh toán
- Backend nhận IPN/callback
- Cập nhật trạng thái đơn hàng
- Thông báo kết quả

## 🔐 Bảo mật

### 1. Chữ ký số
- **Momo**: HMAC SHA256
- **VNPay**: HMAC SHA512
- **Verify** tất cả callback/IPN

### 2. Mã hóa dữ liệu
- **QR string** được mã hóa
- **Order ID** unique cho mỗi đơn
- **Amount** được validate

### 3. CORS & Environment
- **CORS** chỉ cho phép frontend
- **Environment variables** cho sensitive data
- **HTTPS** cho production

## 🚀 Production Deployment

### 1. Environment Variables
```env
# Production URLs
FRONTEND_URL=https://your-domain.com
MOMO_IPN_URL=https://your-domain.com/api/momo/ipn
VNPAY_RETURN_URL=https://your-domain.com/api/vnpay/callback
```

### 2. SSL Certificate
- **HTTPS** bắt buộc cho payment
- **Valid SSL** cho production
- **Domain verification** cho payment gateways

### 3. Database
- **Backup** thường xuyên
- **Index** cho orderId
- **Monitor** payment transactions

## 📞 Troubleshooting

### Lỗi thường gặp
1. **QR không hiển thị** → Kiểm tra API response
2. **Chữ ký sai** → Verify environment variables
3. **Callback không nhận** → Check IPN URL
4. **Amount không đúng** → Validate input data

### Debug
```bash
# Check server logs
npm run dev

# Test API endpoints
node scripts/testDynamicQR.js

# Monitor network requests
Browser DevTools → Network tab
```

## 🎯 Kết quả mong đợi

✅ **Mỗi đơn hàng có QR riêng** với số tiền chính xác
✅ **Tự động tạo QR** khi chọn phương thức thanh toán
✅ **Hiển thị thông tin** đầy đủ và rõ ràng
✅ **Bảo mật cao** với chữ ký và mã hóa
✅ **UX tốt** với loading và responsive design
