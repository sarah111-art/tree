// utils/qrGenerator.js
import QRCode from 'qrcode';

const BANK_INFO = {
  accountNumber: "0346062720", // Thay bằng STK thật của bạn
  bankCode: "ShinhanBank", // Thay bằng mã ngân hàng thật
  accountName: "NGUYEN VAN A", // Thay bằng tên chủ TK thật
  bankName: "ShinhanBank" // Thay bằng tên ngân hàng thật
};

export const generatePaymentQR = async (orderID, amount, description = "Thanh toan don hang") => {
  try {
    // Format nội dung chuyển khoản để Casso nhận diện
    const transferContent = `DH${orderID} ${description}`.toUpperCase();
    
    // Tạo QR theo chuẩn VietQR
    const qrString = `${BANK_INFO.bankCode}|${BANK_INFO.accountNumber}|${BANK_INFO.accountName}|${amount}|${transferContent}`;
    
    // Tạo QR image
    const qrImage = await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return {
      qrImage,
      qrString,
      transferInfo: {
        bankName: BANK_INFO.bankName,
        accountNumber: BANK_INFO.accountNumber,
        accountName: BANK_INFO.accountName,
        amount: amount,
        content: transferContent,
        orderID: orderID
      }
    };
  } catch (error) {
    console.error('Lỗi tạo QR:', error);
    throw error;
  }
};

// Tạo QR tĩnh cho thông tin tài khoản
export const generateStaticQR = async () => {
  try {
    const qrString = `${BANK_INFO.bankCode}|${BANK_INFO.accountNumber}|${BANK_INFO.accountName}`;
    
    const qrImage = await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1
    });
    
    return {
      qrImage,
      qrString,
      bankInfo: {
        bankName: BANK_INFO.bankName,
        accountNumber: BANK_INFO.accountNumber,
        accountName: BANK_INFO.accountName
      }
    };
  } catch (error) {
    console.error('Lỗi tạo QR tĩnh:', error);
    throw error;
  }
};

// Validate thông tin ngân hàng
export const validateBankInfo = () => {
  const required = ['accountNumber', 'bankCode', 'accountName', 'bankName'];
  const missing = required.filter(field => !BANK_INFO[field] || BANK_INFO[field] === '0123456789');
  
  if (missing.length > 0) {
    throw new Error(`Thiếu thông tin ngân hàng: ${missing.join(', ')}`);
  }
  
  return true;
};
