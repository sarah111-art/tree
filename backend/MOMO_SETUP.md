# 🚀 Hướng dẫn thiết lập Momo Payment

## 📋 Yêu cầu hệ thống
- Node.js 16+
- MongoDB
- Tài khoản Momo Business (test hoặc production)

## 🔧 Thiết lập

### 1. Tạo file .env
Tạo file `.env` trong thư mục `backend/` với nội dung:

```env
# Database
MONGO_URL=mongodb://localhost:27017/your_database_name

# Server
PORT=5001

# Momo Payment Configuration
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=F8BBA842ECF85
MOMO_SECRET_KEY=K951B6PE1waDMi640xX08PD3vg6EkVlz
MOMO_IPN_URL=http://localhost:5001/api/momo/ipn

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
```

### 2. Cài đặt dependencies
```bash
cd backend
npm install
```

### 3. Khởi động server
```bash
npm start
```

## 🧪 Test hệ thống

### Chạy script test
```bash
node scripts/testMomoPayment.js
```

### Test thủ công

#### 1. Tạo QR Momo
```bash
curl -X POST http://localhost:5001/api/qr \
  -H "Content-Type: application/json" \
  -d '{
    "type": "momo",
    "imageUrl": "https://example.com/momo-qr.jpg",
    "phoneNumber": "0123456789",
    "accountName": "Nguyễn Văn A"
  }'
```

#### 2. Lấy QR Momo
```bash
curl http://localhost:5001/api/qr/momo
```

#### 3. Tạo thanh toán Momo
```bash
curl -X POST http://localhost:5001/api/momo/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "orderId": "TEST_123456",
    "orderInfo": "Thanh toán test",
    "redirectUrl": "http://localhost:3000/payment-success"
  }'
```

## 📡 API Endpoints

### QR Management
- `GET /api/qr` - Lấy tất cả QR
- `GET /api/qr/momo` - Lấy QR Momo
- `POST /api/qr` - Tạo/cập nhật QR

### Momo Payment
- `POST /api/momo/create-payment` - Tạo thanh toán Momo
- `POST /api/momo/ipn` - Webhook IPN từ Momo

## 🔐 Bảo mật

### IPN (Instant Payment Notification)
- Momo sẽ gọi về endpoint `/api/momo/ipn` sau khi thanh toán
- Hệ thống sẽ verify chữ ký để đảm bảo an toàn
- Cập nhật trạng thái đơn hàng dựa trên kết quả

### Environment Variables
- Không commit file `.env` vào git
- Sử dụng biến môi trường khác nhau cho test/production

## 🚨 Lưu ý quan trọng

1. **Test Environment**: Sử dụng thông tin test của Momo
2. **Production**: Đăng ký tài khoản business và lấy thông tin thật
3. **IPN URL**: Phải là URL public có thể truy cập từ internet
4. **SSL**: Production cần HTTPS
5. **Error Handling**: Luôn xử lý lỗi và log đầy đủ

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra log server
2. Verify thông tin Momo trong .env
3. Test kết nối database
4. Kiểm tra network và firewall
