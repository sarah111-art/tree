// scripts/testDynamicQR.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

// Test tạo QR Momo động
const testCreateMomoQR = async () => {
  try {
    const qrData = {
      amount: 50000, // 50,000 VND
      orderId: 'MOMO_TEST_' + Date.now(),
      orderInfo: 'Thanh toán test sản phẩm qua Momo QR'
    };

    console.log('🔄 Đang tạo QR Momo động...');
    const response = await axios.post(`${BASE_URL}/momo/create-qr`, qrData);
    
    console.log('✅ Kết quả:', response.data);
    
    if (response.data.qrCode) {
      console.log('📱 QR Code đã được tạo thành công!');
      console.log('🔢 Order ID:', response.data.orderId);
      console.log('💰 Số tiền:', response.data.amount.toLocaleString(), 'VND');
    }
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
};

// Test tạo QR VNPay động
const testCreateVNPayQR = async () => {
  try {
    const qrData = {
      amount: 75000, // 75,000 VND
      orderId: 'VNPAY_TEST_' + Date.now(),
      orderInfo: 'Thanh toán test sản phẩm qua VNPay QR'
    };

    console.log('🔄 Đang tạo QR VNPay động...');
    const response = await axios.post(`${BASE_URL}/vnpay/create-qr`, qrData);
    
    console.log('✅ Kết quả:', response.data);
    
    if (response.data.qrCode) {
      console.log('🏦 QR Code đã được tạo thành công!');
      console.log('🔢 Order ID:', response.data.orderId);
      console.log('💰 Số tiền:', response.data.amount.toLocaleString(), 'VND');
    }
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
};

// Test tạo thanh toán Momo
const testCreateMomoPayment = async () => {
  try {
    const paymentData = {
      amount: 100000, // 100,000 VND
      orderId: 'MOMO_PAY_' + Date.now(),
      orderInfo: 'Thanh toán test qua Momo Gateway',
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

// Test tạo thanh toán VNPay
const testCreateVNPayPayment = async () => {
  try {
    const paymentData = {
      amount: 125000, // 125,000 VND
      orderId: 'VNPAY_PAY_' + Date.now(),
      orderInfo: 'Thanh toán test qua VNPay Gateway',
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

// Chạy các test
const runTests = async () => {
  console.log('🚀 Bắt đầu test Dynamic QR Payment...\n');
  
  console.log('=== Test 1: Tạo QR Momo động ===');
  await testCreateMomoQR();
  
  console.log('\n=== Test 2: Tạo QR VNPay động ===');
  await testCreateVNPayQR();
  
  console.log('\n=== Test 3: Tạo thanh toán Momo Gateway ===');
  await testCreateMomoPayment();
  
  console.log('\n=== Test 4: Tạo thanh toán VNPay Gateway ===');
  await testCreateVNPayPayment();
  
  console.log('\n✅ Hoàn thành test!');
};

runTests();
