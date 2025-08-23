// scripts/testVNPayPayment.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

// Test tạo thanh toán VNPay
const testCreateVNPayPayment = async () => {
  try {
    const paymentData = {
      amount: 50000, // 50,000 VND
      orderId: 'VNPAY_TEST_' + Date.now(),
      orderInfo: 'Thanh toán test sản phẩm qua VNPay',
      redirectUrl: 'http://localhost:3000/payment-success'
    };

    console.log('🔄 Đang tạo thanh toán VNPay...');
    const response = await axios.post(`${BASE_URL}/vnpay/create-payment`, paymentData);
    
    console.log('✅ Kết quả:', response.data);
    
    if (response.data.payUrl) {
      console.log('🔗 Link thanh toán:', response.data.payUrl);
    }
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
};

// Test tạo QR VNPay
const testCreateVNPayQR = async () => {
  try {
    const qrData = {
      amount: 50000,
      orderId: 'VNPAY_QR_TEST_' + Date.now(),
      orderInfo: 'Tạo QR VNPay test'
    };

    console.log('🔄 Đang tạo QR VNPay...');
    const response = await axios.post(`${BASE_URL}/vnpay/create-qr`, qrData);
    console.log('✅ Kết quả:', response.data);
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
};

// Test lấy QR VNPay từ database
const testGetVNPayQR = async () => {
  try {
    console.log('🔄 Đang lấy QR VNPay từ database...');
    const response = await axios.get(`${BASE_URL}/qr/vnpay`);
    console.log('✅ QR VNPay:', response.data);
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
};

// Test tạo QR VNPay trong database
const testCreateVNPayQRInDB = async () => {
  try {
    const qrData = {
      type: 'vnpay',
      imageUrl: 'https://example.com/vnpay-qr.jpg',
      bankCode: 'VCB',
      accountNumber: '1234567890'
    };

    console.log('🔄 Đang tạo QR VNPay trong database...');
    const response = await axios.post(`${BASE_URL}/qr`, qrData);
    console.log('✅ Kết quả:', response.data);
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
};

// Test tạo đơn hàng bank với VNPay QR
const testCreateBankOrderWithVNPay = async () => {
  try {
    const orderData = {
      customer: {
        name: 'Nguyễn Văn Test',
        phone: '0123456789',
        address: '123 Đường Test, TP Test'
      },
      items: [
        {
          _id: '1',
          name: 'Sản phẩm test',
          price: 50000,
          quantity: 1
        }
      ],
      total: 50000
    };

    console.log('🔄 Đang tạo đơn hàng bank với VNPay QR...');
    const response = await axios.post(`${BASE_URL}/bank/create-order`, orderData);
    console.log('✅ Kết quả:', response.data);
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
};

// Chạy các test
const runTests = async () => {
  console.log('🚀 Bắt đầu test VNPay Payment...\n');
  
  console.log('=== Test 1: Tạo QR VNPay trong database ===');
  await testCreateVNPayQRInDB();
  
  console.log('\n=== Test 2: Lấy QR VNPay từ database ===');
  await testGetVNPayQR();
  
  console.log('\n=== Test 3: Tạo đơn hàng bank với VNPay QR ===');
  await testCreateBankOrderWithVNPay();
  
  console.log('\n=== Test 4: Tạo QR VNPay động ===');
  await testCreateVNPayQR();
  
  console.log('\n=== Test 5: Tạo thanh toán VNPay ===');
  await testCreateVNPayPayment();
  
  console.log('\n✅ Hoàn thành test!');
};

runTests();
