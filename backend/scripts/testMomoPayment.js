// scripts/testMomoPayment.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

// Test tạo thanh toán Momo
const testCreateMomoPayment = async () => {
  try {
    const paymentData = {
      amount: 50000, // 50,000 VND
      orderId: 'TEST_' + Date.now(),
      orderInfo: 'Thanh toán test sản phẩm',
      redirectUrl: 'http://localhost:3000/payment-success'
    };

    console.log('🔄 Đang tạo thanh toán Momo...');
    const response = await axios.post(`${BASE_URL}/momo/create-payment`, paymentData);
    
    console.log('✅ Kết quả:', response.data);
    
    if (response.data.payUrl) {
      console.log('🔗 Link thanh toán:', response.data.payUrl);
    }
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
};

// Test lấy QR Momo
const testGetMomoQR = async () => {
  try {
    console.log('🔄 Đang lấy QR Momo...');
    const response = await axios.get(`${BASE_URL}/qr/momo`);
    console.log('✅ QR Momo:', response.data);
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
};

// Test tạo QR Momo
const testCreateMomoQR = async () => {
  try {
    const qrData = {
      type: 'momo',
      imageUrl: 'https://example.com/momo-qr.jpg',
      phoneNumber: '0123456789',
      accountName: 'Nguyễn Văn A'
    };

    console.log('🔄 Đang tạo QR Momo...');
    const response = await axios.post(`${BASE_URL}/qr`, qrData);
    console.log('✅ Kết quả:', response.data);
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
};

// Chạy các test
const runTests = async () => {
  console.log('🚀 Bắt đầu test Momo Payment...\n');
  
  console.log('=== Test 1: Tạo QR Momo ===');
  await testCreateMomoQR();
  
  console.log('\n=== Test 2: Lấy QR Momo ===');
  await testGetMomoQR();
  
  console.log('\n=== Test 3: Tạo thanh toán Momo ===');
  await testCreateMomoPayment();
  
  console.log('\n✅ Hoàn thành test!');
};

runTests();
