// ✅ CONTROLLER: controllers/momoController.js

import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// 📌 Tạo yêu cầu thanh toán Momo
export const createMomoPayment = async (req, res) => {
  try {
    const { amount, orderId, orderInfo, redirectUrl } = req.body;

    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const ipnUrl = process.env.MOMO_IPN_URL;
    const requestType = 'captureWallet';
    const extraData = '';

    const requestId = partnerCode + new Date().getTime();
    const orderIdStr = orderId || partnerCode + new Date().getTime();
    const orderInfoStr = orderInfo || 'Thanh toan qua MoMo';
    const redirectUrlStr = redirectUrl || 'https://webhook.site/b88d02f5-c29a-40ce-ba30-6e5b8b3c9f8c';
    const amountNum = amount;
    const rawSignature = `accessKey=${accessKey}&amount=${amountNum}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderIdStr}&orderInfo=${orderInfoStr}&partnerCode=${partnerCode}&redirectUrl=${redirectUrlStr}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    const requestBody = {
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amountNum,
      orderId: orderIdStr,
      orderInfo: orderInfoStr,
      redirectUrl: redirectUrlStr,
      ipnUrl: ipnUrl,
      lang: 'vi',
      extraData: extraData,
      requestType: requestType,
      signature: signature
    };

    const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.resultCode === 0) {
      res.json({
        resultCode: 0,
        message: 'Tạo thanh toán Momo thành công',
        payUrl: response.data.payUrl,
        orderId: orderIdStr
      });
    } else {
      res.status(400).json({
        resultCode: response.data.resultCode,
        message: response.data.message || 'Lỗi tạo thanh toán Momo'
      });
    }
  } catch (err) {
    console.error('Momo error:', err);
    res.status(500).json({ message: 'Lỗi tạo thanh toán Momo', error: err.message });
  }
};

// 📌 Tạo QR code động cho Momo
export const createMomoQR = async (req, res) => {
  try {
    const { amount, orderId, orderInfo } = req.body;

    // Kiểm tra environment variables
    const partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMO';
    const accessKey = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85';
    const secretKey = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    
    if (!partnerCode || !accessKey || !secretKey) {
      console.error('❌ Thiếu environment variables cho Momo');
      return res.status(500).json({ 
        message: 'Cấu hình Momo chưa hoàn chỉnh', 
        error: 'Missing environment variables' 
      });
    }

    const requestType = 'captureWallet';
    const extraData = '';

    const requestId = partnerCode + new Date().getTime();
    const orderIdStr = orderId || partnerCode + new Date().getTime();
    const orderInfoStr = orderInfo || 'Thanh toan qua MoMo';
    const amountNum = amount;

    // Tạo QR code string cho Momo
    const qrString = `2|${partnerCode}|${orderIdStr}|${amountNum}|${orderInfoStr}`;
    
    // Tạo chữ ký cho QR
    const rawSignature = `accessKey=${accessKey}&amount=${amountNum}&extraData=${extraData}&orderId=${orderIdStr}&orderInfo=${orderInfoStr}&partnerCode=${partnerCode}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    try {
      // Tạo QR code base64 (sử dụng thư viện qrcode)
      const QRCode = await import('qrcode');
      const qrCodeBase64 = await QRCode.toDataURL(qrString, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Lấy base64 string từ data URL
      const base64String = qrCodeBase64.split(',')[1];

      res.json({
        resultCode: 0,
        message: 'Tạo QR Momo thành công',
        qrCode: base64String,
        orderId: orderIdStr,
        amount: amountNum,
        qrString: qrString
      });
    } catch (qrError) {
      console.error('❌ Lỗi tạo QR code:', qrError);
      // Fallback: trả về QR string thay vì base64
      res.json({
        resultCode: 0,
        message: 'Tạo QR Momo thành công (string only)',
        qrString: qrString,
        orderId: orderIdStr,
        amount: amountNum,
        error: 'QR image generation failed, using string only'
      });
    }
  } catch (err) {
    console.error('❌ Momo QR error:', err);
    res.status(500).json({ 
      message: 'Lỗi tạo QR Momo', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// 📌 Xử lý IPN từ Momo
export const handleMomoIPN = async (req, res) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      signature
    } = req.body;

    // Verify signature
    const secretKey = process.env.MOMO_SECRET_KEY;
    const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=&ipnUrl=${process.env.MOMO_IPN_URL}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${new Date().getTime()}&resultCode=${resultCode}&transId=${transId}`;
    const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    if (signature !== expectedSignature) {
      console.error('❌ Sai chữ ký Momo IPN');
      return res.status(400).json({ message: 'Sai chữ ký' });
    }

    if (resultCode === 0) {
      console.log(`✅ Thanh toán thành công cho đơn ${orderId}`);
      try {
        const Order = (await import('../models/orderModel.js')).default;
        const updatedOrder = await Order.findOneAndUpdate(
          { orderId: orderId },
          {
            status: 'paid',
            paymentMethod: 'momo',
            paymentId: transId,
            paidAt: new Date()
          },
          { new: true }
        );
        if (updatedOrder) {
          console.log(`✅ Đã cập nhật đơn hàng ${orderId} thành công`);
        } else {
          console.warn(`⚠️ Không tìm thấy đơn hàng ${orderId} để cập nhật`);
        }
      } catch (dbError) {
        console.error('❌ Lỗi cập nhật database:', dbError);
      }
    } else {
      console.warn(`⚠️ Giao dịch thất bại đơn ${orderId} - Momo code: ${resultCode}`);
    }

    res.status(200).json({ message: 'IPN received' });
  } catch (err) {
    console.error('Momo IPN error:', err);
    res.status(500).json({ message: 'Lỗi xử lý IPN', error: err.message });
  }
};