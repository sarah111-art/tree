# 🚀 Hướng dẫn tích hợp Payment vào Frontend

## 📋 Components đã tạo

### 1. PaymentMethodSelector.js
Component chọn phương thức thanh toán với giao diện card đẹp.

**Tính năng:**
- Hiển thị 4 phương thức thanh toán: COD, Momo, VNPay QR, Bank Transfer
- Giao diện card với màu sắc khác nhau cho từng phương thức
- Animation và hover effects
- Radio button để chọn

### 2. PaymentInfo.js
Component hiển thị thông tin thanh toán chi tiết.

**Tính năng:**
- Hiển thị QR code và thông tin tài khoản
- Thông tin thanh toán (số tiền, nội dung)
- Hướng dẫn thanh toán
- Responsive design

### 3. MomoQR.js & VNPayQR.js
Components riêng biệt cho từng loại QR.

### 4. MomoPayment.js & VNPayPayment.js
Components xử lý thanh toán qua gateway.

## 🔧 Cách sử dụng

### Trong Checkout.js
```jsx
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import PaymentInfo from '../components/PaymentInfo';

// Trong component
const [paymentMethod, setPaymentMethod] = useState('cod');
const [qrInfo, setQrInfo] = useState({});

// Load QR info
useEffect(() => {
  const fetchQR = async () => {
    const res = await axios.get(`${backendUrl}/api/qr`);
    // Process QR data...
  };
  fetchQR();
}, []);

// Render
<PaymentMethodSelector
  selectedMethod={paymentMethod}
  onMethodChange={setPaymentMethod}
/>

<PaymentInfo
  type={paymentMethod}
  qrInfo={qrInfo}
  amount={totalAmount}
  customerName={form.name}
/>
```

## 🎨 Styling

### Tailwind Classes được sử dụng
- `bg-pink-50`, `border-pink-200` - Màu Momo
- `bg-blue-50`, `border-blue-200` - Màu VNPay
- `bg-green-50`, `border-green-200` - Màu COD
- `bg-purple-50`, `border-purple-200` - Màu Bank

### Responsive Design
- `grid md:grid-cols-2` - Layout 2 cột trên desktop
- `w-48 h-48` - Kích thước QR code
- `space-y-3` - Spacing giữa các elements

## 📡 API Integration

### Backend Endpoints
- `GET /api/qr` - Lấy tất cả QR codes
- `GET /api/qr/momo` - Lấy QR Momo
- `GET /api/qr/vnpay` - Lấy QR VNPay
- `POST /api/momo/create-payment` - Tạo thanh toán Momo
- `POST /api/vnpay/create-payment` - Tạo thanh toán VNPay

### Data Structure
```javascript
const qrInfo = {
  momo: {
    imageUrl: 'https://example.com/momo-qr.jpg',
    phoneNumber: '0123456789',
    accountName: 'Nguyễn Văn A'
  },
  vnpay: {
    imageUrl: 'https://example.com/vnpay-qr.jpg',
    bankCode: 'VCB',
    accountNumber: '1234567890'
  }
};
```

## 🔐 Bảo mật

### CORS Configuration
```javascript
// backend/server.js
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
```

### Environment Variables
```env
# frontend/.env
REACT_APP_API_URL=http://localhost:5001/api
```

## 🧪 Testing

### Test Components
```jsx
// Test PaymentMethodSelector
<PaymentMethodSelector
  selectedMethod="momo"
  onMethodChange={(method) => console.log('Selected:', method)}
/>

// Test PaymentInfo
<PaymentInfo
  type="momo"
  qrInfo={mockQrInfo}
  amount={50000}
  customerName="Test User"
/>
```

## 🚀 Deployment

### Build cho Production
```bash
npm run build
```

### Environment Variables cho Production
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console browser
2. Verify API endpoints
3. Kiểm tra CORS configuration
4. Test với Postman/curl
5. Xem log backend server
