# 🚀 Hướng dẫn sử dụng Momo Payment trong Frontend

## 📋 Components đã tạo

### 1. MomoQR.js
Component hiển thị QR code Momo để thanh toán thủ công.

**Cách sử dụng:**
```jsx
import MomoQR from './components/MomoQR';

function CheckoutPage() {
  const handlePaymentSuccess = () => {
    // Xử lý khi người dùng báo đã thanh toán xong
    console.log('Payment completed');
  };

  return (
    <div>
      <h2>Thanh toán</h2>
      <MomoQR onPaymentSuccess={handlePaymentSuccess} />
    </div>
  );
}
```

### 2. MomoPayment.js
Component tạo thanh toán qua cổng thanh toán Momo.

**Cách sử dụng:**
```jsx
import MomoPayment from './components/MomoPayment';

function CheckoutPage() {
  const handlePaymentSuccess = () => {
    // Xử lý khi thanh toán thành công
    console.log('Payment successful');
  };

  const handlePaymentError = (error) => {
    // Xử lý khi có lỗi
    console.error('Payment error:', error);
  };

  return (
    <div>
      <h2>Thanh toán</h2>
      <MomoPayment
        amount={50000}
        orderId="ORDER_123456"
        orderInfo="Thanh toán đơn hàng"
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}
```

### 3. PaymentSuccess.js
Trang hiển thị kết quả thanh toán.

**Cách sử dụng:**
```jsx
// Trong App.js hoặc router
import PaymentSuccess from './pages/PaymentSuccess';

// Route
<Route path="/payment-success" element={<PaymentSuccess />} />
```

## 🔧 Tích hợp vào Checkout

### Cập nhật Checkout.js
```jsx
import React, { useState } from 'react';
import MomoQR from '../components/MomoQR';
import MomoPayment from '../components/MomoPayment';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('qr'); // 'qr' hoặc 'gateway'
  const [orderData, setOrderData] = useState({
    amount: 50000,
    orderId: 'ORDER_' + Date.now(),
    orderInfo: 'Thanh toán đơn hàng'
  });

  const handlePaymentSuccess = () => {
    // Chuyển hướng hoặc cập nhật trạng thái
    window.location.href = '/payment-success';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>
      
      {/* Chọn phương thức thanh toán */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Chọn phương thức thanh toán</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setPaymentMethod('qr')}
            className={`px-4 py-2 rounded ${
              paymentMethod === 'qr' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            QR Code
          </button>
          <button
            onClick={() => setPaymentMethod('gateway')}
            className={`px-4 py-2 rounded ${
              paymentMethod === 'gateway' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Cổng thanh toán
          </button>
        </div>
      </div>

      {/* Hiển thị component thanh toán */}
      {paymentMethod === 'qr' ? (
        <MomoQR onPaymentSuccess={handlePaymentSuccess} />
      ) : (
        <MomoPayment
          amount={orderData.amount}
          orderId={orderData.orderId}
          orderInfo={orderData.orderInfo}
          onSuccess={handlePaymentSuccess}
          onError={(error) => alert('Lỗi: ' + error)}
        />
      )}
    </div>
  );
};

export default Checkout;
```

## 📡 API Endpoints

### Backend URLs (cần cập nhật trong components)
- `http://localhost:5001/api/momo/create-payment` - Tạo thanh toán
- `http://localhost:5001/api/qr/momo` - Lấy QR Momo
- `http://localhost:5001/api/qr` - Quản lý QR

### Cập nhật URL cho production
```jsx
// Tạo file config
// src/config/api.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api'
  : 'http://localhost:5001/api';

export default API_BASE_URL;
```

## 🎨 Styling

### Tailwind CSS Classes đã sử dụng
- `bg-green-500`, `hover:bg-green-600` - Màu xanh Momo
- `rounded-lg`, `shadow-lg` - Bo góc và shadow
- `animate-spin` - Loading animation
- `transition-colors` - Smooth hover effects

### Custom CSS (nếu cần)
```css
/* src/components/MomoQR.css */
.momo-qr-container {
  max-width: 400px;
  margin: 0 auto;
}

.momo-qr-image {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
}
```

## 🔐 Bảo mật

### CORS Configuration
Đảm bảo backend cho phép frontend domain:
```javascript
// backend/server.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true
}));
```

### Environment Variables
```env
# frontend/.env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_MOMO_ENABLED=true
```

## 🧪 Testing

### Test Components
```jsx
// src/components/__tests__/MomoQR.test.js
import { render, screen } from '@testing-library/react';
import MomoQR from '../MomoQR';

test('renders Momo QR component', () => {
  render(<MomoQR />);
  expect(screen.getByText(/Thanh toán qua Momo/i)).toBeInTheDocument();
});
```

### Test API Calls
```jsx
// src/services/momoService.test.js
import axios from 'axios';
import { createMomoPayment } from '../services/momoService';

jest.mock('axios');

test('creates Momo payment successfully', async () => {
  const mockResponse = { data: { resultCode: 0, payUrl: 'https://test.momo.vn' } };
  axios.post.mockResolvedValue(mockResponse);

  const result = await createMomoPayment({
    amount: 50000,
    orderId: 'TEST_123',
    orderInfo: 'Test payment'
  });

  expect(result.resultCode).toBe(0);
});
```

## 🚀 Deployment

### Build cho Production
```bash
npm run build
```

### Environment Variables cho Production
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_MOMO_ENABLED=true
```

### Nginx Configuration (nếu cần)
```nginx
location /api {
    proxy_pass http://localhost:5001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console browser
2. Verify API endpoints
3. Kiểm tra CORS configuration
4. Test với Postman/curl
5. Xem log backend server
