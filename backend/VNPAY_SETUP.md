# 🚀 Hướng dẫn thiết lập VNPay Payment

## 📋 Yêu cầu hệ thống
- Node.js 16+
- MongoDB
- Tài khoản VNPay Merchant (test hoặc production)

## 🔧 Thiết lập

### 1. Cập nhật file .env
Thêm các biến môi trường VNPay vào file `.env`:

```env
# VNPay Configuration
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5001/api/vnpay/callback
VNPAY_QR_URL=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
FRONTEND_URL=http://localhost:3000
```

### 2. Test hệ thống
```bash
node scripts/testVNPayPayment.js
```

## 📡 API Endpoints

### VNPay Payment
- `POST /api/vnpay/create-payment` - Tạo thanh toán VNPay
- `GET /api/vnpay/callback` - Callback từ VNPay
- `POST /api/vnpay/create-qr` - Tạo QR VNPay động

### QR Management
- `GET /api/qr/vnpay` - Lấy QR VNPay
- `POST /api/qr` - Tạo/cập nhật QR VNPay

### Bank Integration
- `POST /api/bank/create-order` - Tạo đơn hàng với VNPay QR
- `GET /api/bank/vnpay-qr` - Lấy thông tin VNPay QR

## 🔐 Bảo mật
- Verify chữ ký VNPay callback
- Cập nhật trạng thái đơn hàng tự động
- Logging chi tiết

## 🚨 Lưu ý
1. Test Environment: Sử dụng sandbox VNPay
2. Production: Đăng ký merchant account thật
3. Callback URL: Phải là URL public
4. SSL: Production cần HTTPS
