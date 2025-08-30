// utils/vietqrGenerator.js

// Cấu hình ngân hàng của bạn
const BANK_CONFIG = {
  bankId: "970436", // Vietcombank - Thay bằng mã ngân hàng thật
  accountNo: "1040812126", // Thay bằng STK thật
  accountName: "NGUYEN TIET XUAN QUY", // Thay bằng tên chủ TK thật
  bankName: "Vietcombank" // Thay bằng tên ngân hàng thật
};

// Danh sách mã ngân hàng phổ biến
const BANK_CODES = {
  "VCB": "970436", // Vietcombank
  "BIDV": "970418", // BIDV
  "AGB": "970403", // Agribank
  "TCB": "970407", // Techcombank
  "MB": "970422", // MB Bank
  "VPB": "970432", // VPBank
  "ACB": "970416", // ACB
  "SHB": "970443", // SHB
  "SCB": "970429", // Sacombank
  "TPB": "970423", // TPBank
  "MSB": "970426", // MSB
  "STB": "970403", // Sacombank
  "VIB": "970441", // VIB
  "OCB": "970428", // OCB
  "SHINHAN": "970424", // Shinhan Bank
  "VIETIN": "970415", // VietinBank
  "EXIM": "970431", // Eximbank
  "HDB": "970437", // HDBank
  "SEA": "970440", // SeABank
  "ABB": "970425", // ABBank
  "BAB": "970409", // BacABank
  "GPB": "970408", // GPBank
  "ICB": "970405", // ICB
  "VAB": "970427", // VietABank
  "BVB": "970438", // BaoVietBank
  "VIETB": "970433", // VietBank
  "PGB": "970430", // PGBank
  "OJB": "970440", // OceanBank
  "LPB": "970449", // LienVietPostBank
  "NAB": "970428", // NamABank
  "SHB": "970443", // SHB
  "SGB": "970400", // SGBank
  "NVB": "970411", // Navibank
  "VCCB": "970454", // VietCapitalBank
  "KLB": "970409", // KienLongBank
  "TAB": "970406", // TienPhongBank
  "BAB": "970409", // BacABank
  "GPB": "970408", // GPBank
  "ICB": "970405", // ICB
  "VAB": "970427", // VietABank
  "BVB": "970438", // BaoVietBank
  "VIETB": "970433", // VietBank
  "PGB": "970430", // PGBank
  "OJB": "970440", // OceanBank
  "LPB": "970449", // LienVietPostBank
  "NAB": "970428", // NamABank
  "SHB": "970443", // SHB
  "SGB": "970400", // SGBank
  "NVB": "970411", // Navibank
  "VCCB": "970454", // VietCapitalBank
  "KLB": "970409", // KienLongBank
  "TAB": "970406", // TienPhongBank
};

// Tạo QR VietQR với số tiền cố định
export const generateVietQR = async (amount, orderID, description = "Thanh toan don hang") => {
  try {
    // Format nội dung chuyển khoản
    const addInfo = `${description} ${orderID}`.toUpperCase();
    
    // Tạo URL VietQR API (miễn phí)
    const qrUrl = `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(addInfo)}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`;
    
    return {
      qrImageUrl: qrUrl,
      bankInfo: {
        bankName: BANK_CONFIG.bankName,
        accountNo: BANK_CONFIG.accountNo,
        accountName: BANK_CONFIG.accountName,
        amount: amount,
        content: addInfo,
        orderID: orderID
      },
      instructions: [
        '1. Mở app ngân hàng trên điện thoại',
        '2. Chọn "Quét mã QR" hoặc "Chuyển khoản"',
        '3. Quét mã QR bên trên',
        '4. Kiểm tra thông tin và xác nhận thanh toán',
        '5. Đợi hệ thống tự động cập nhật trạng thái'
      ]
    };
  } catch (error) {
    console.error('Lỗi tạo VietQR:', error);
    throw error;
  }
};

// Tạo QR cho nhiều ngân hàng
export const generateMultiBankQR = async (amount, orderID, description = "Thanh toan don hang") => {
  try {
    const banks = [
      { code: "VCB", name: "Vietcombank" },
      { code: "BIDV", name: "BIDV" },
      { code: "AGB", name: "Agribank" },
      { code: "TCB", name: "Techcombank" },
      { code: "MB", name: "MB Bank" }
    ];
    
    const results = {};
    
    for (const bank of banks) {
      const bankId = BANK_CODES[bank.code];
      if (bankId) {
        const addInfo = `${description} ${orderID}`.toUpperCase();
        const qrUrl = `https://img.vietqr.io/image/${bankId}-${BANK_CONFIG.accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(addInfo)}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`;
        
        results[bank.code] = {
          bankName: bank.name,
          qrImageUrl: qrUrl,
          accountNo: BANK_CONFIG.accountNo,
          accountName: BANK_CONFIG.accountName,
          amount: amount,
          content: addInfo
        };
      }
    }
    
    return results;
  } catch (error) {
    console.error('Lỗi tạo MultiBank QR:', error);
    throw error;
  }
};

// Validate cấu hình ngân hàng
export const validateBankConfig = () => {
  const errors = [];
  
  if (!BANK_CONFIG.bankId || BANK_CONFIG.bankId === "970436") {
    errors.push('Chưa cấu hình mã ngân hàng');
  }
  
  if (!BANK_CONFIG.accountNo || BANK_CONFIG.accountNo === "0123456789") {
    errors.push('Chưa cấu hình số tài khoản');
  }
  
  if (!BANK_CONFIG.accountName || BANK_CONFIG.accountName === "NGUYEN VAN A") {
    errors.push('Chưa cấu hình tên chủ tài khoản');
  }
  
  if (errors.length > 0) {
    throw new Error(`Cấu hình chưa hoàn chỉnh: ${errors.join(', ')}`);
  }
  
  return true;
};

// Lấy danh sách ngân hàng hỗ trợ
export const getSupportedBanks = () => {
  return Object.keys(BANK_CODES).map(code => ({
    code: code,
    name: getBankName(code),
    bankId: BANK_CODES[code]
  }));
};

// Lấy tên ngân hàng
const getBankName = (code) => {
  const bankNames = {
    "VCB": "Vietcombank",
    "BIDV": "BIDV",
    "AGB": "Agribank",
    "TCB": "Techcombank",
    "MB": "MB Bank",
    "VPB": "VPBank",
    "ACB": "ACB",
    "SHB": "SHB",
    "SCB": "Sacombank",
    "TPB": "TPBank",
    "MSB": "MSB",
    "STB": "Sacombank",
    "VIB": "VIB",
    "OCB": "OCB",
    "SHINHAN": "Shinhan Bank",
    "VIETIN": "VietinBank",
    "EXIM": "Eximbank",
    "HDB": "HDBank",
    "SEA": "SeABank",
    "ABB": "ABBank",
    "BAB": "BacABank",
    "GPB": "GPBank",
    "ICB": "ICB",
    "VAB": "VietABank",
    "BVB": "BaoVietBank",
    "VIETB": "VietBank",
    "PGB": "PGBank",
    "OJB": "OceanBank",
    "LPB": "LienVietPostBank",
    "NAB": "NamABank",
    "SGB": "SGBank",
    "NVB": "Navibank",
    "VCCB": "VietCapitalBank",
    "KLB": "KienLongBank",
    "TAB": "TienPhongBank"
  };
  
  return bankNames[code] || code;
};

// Cập nhật cấu hình ngân hàng
export const updateBankConfig = (newConfig) => {
  Object.assign(BANK_CONFIG, newConfig);
  console.log('✅ Đã cập nhật cấu hình ngân hàng:', BANK_CONFIG);
};
