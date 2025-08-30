// controllers/vietqrController.js
import { 
  generateVietQR, 
  generateMultiBankQR, 
  validateBankConfig,
  getSupportedBanks,
  updateBankConfig
} from '../utils/vietqrGenerator.js';

// Tạo QR VietQR đơn giản
export const createVietQR = async (req, res) => {
  try {
    const { amount, orderId, description } = req.body;
    
    if (!amount || !orderId) {
      return res.status(400).json({ 
        message: 'Thiếu thông tin: amount, orderId' 
      });
    }
    
    // Validate cấu hình ngân hàng
    try {
      validateBankConfig();
    } catch (error) {
      return res.status(500).json({ 
        message: 'Chưa cấu hình thông tin ngân hàng',
        error: error.message 
      });
    }
    
    // Tạo QR
    const qrData = await generateVietQR(amount, orderId, description);
    
    res.json({
      success: true,
      qrImageUrl: qrData.qrImageUrl,
      bankInfo: qrData.bankInfo,
      instructions: qrData.instructions
    });
    
  } catch (error) {
    console.error('❌ Lỗi tạo VietQR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Tạo QR cho nhiều ngân hàng
export const createMultiBankQR = async (req, res) => {
  try {
    const { amount, orderId, description } = req.body;
    
    if (!amount || !orderId) {
      return res.status(400).json({ 
        message: 'Thiếu thông tin: amount, orderId' 
      });
    }
    
    // Validate cấu hình ngân hàng
    try {
      validateBankConfig();
    } catch (error) {
      return res.status(500).json({ 
        message: 'Chưa cấu hình thông tin ngân hàng',
        error: error.message 
      });
    }
    
    // Tạo QR cho nhiều ngân hàng
    const qrData = await generateMultiBankQR(amount, orderId, description);
    
    res.json({
      success: true,
      banks: qrData
    });
    
  } catch (error) {
    console.error('❌ Lỗi tạo MultiBank QR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Lấy danh sách ngân hàng hỗ trợ
export const getBanks = async (req, res) => {
  try {
    const banks = getSupportedBanks();
    
    res.json({
      success: true,
      banks: banks
    });
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách ngân hàng:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Cập nhật cấu hình ngân hàng
export const updateConfig = async (req, res) => {
  try {
    const { bankId, accountNo, accountName, bankName } = req.body;
    
    if (!bankId || !accountNo || !accountName) {
      return res.status(400).json({ 
        message: 'Thiếu thông tin: bankId, accountNo, accountName' 
      });
    }
    
    // Cập nhật cấu hình
    updateBankConfig({
      bankId,
      accountNo,
      accountName,
      bankName: bankName || 'Ngân hàng'
    });
    
    res.json({
      success: true,
      message: 'Đã cập nhật cấu hình ngân hàng'
    });
    
  } catch (error) {
    console.error('❌ Lỗi cập nhật cấu hình:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Test QR generation
export const testQR = async (req, res) => {
  try {
    const testOrderId = 'TEST_' + Date.now();
    const testAmount = 1000;
    
    // Test VietQR đơn giản
    const vietqrResult = await generateVietQR(testAmount, testOrderId, 'Test thanh toan');
    
    // Test MultiBank QR
    const multibankResult = await generateMultiBankQR(testAmount, testOrderId, 'Test thanh toan');
    
    res.json({
      success: true,
      testOrderId: testOrderId,
      testAmount: testAmount,
      vietqr: vietqrResult,
      multibank: multibankResult
    });
    
  } catch (error) {
    console.error('❌ Lỗi test QR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
