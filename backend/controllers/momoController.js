// ✅ CONTROLLER: controllers/momoController.js

import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// 📌 Tạo yêu cầu thanh toán
export const createMomoPayment = async (req, res) => {
  try {
    const { amount, orderId, orderInfo, redirectUrl } = req.body;

    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const requestId = orderId + '-' + Date.now();
    const requestType = 'captureWallet';
    const ipnUrl = process.env.MOMO_IPN_URL;

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    const payload = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData: '',
      requestType,
      signature,
      lang: 'vi',
    };

    const momoRes = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', payload);
    res.json(momoRes.data);
  } catch (err) {
    console.error('Momo error:', err);
    res.status(500).json({ message: 'Lỗi tạo thanh toán Momo', error: err.message });
  }
};

// 📌 Xử lý IPN từ Momo để xác nhận thanh toán (sau khi Momo gọi về)
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
      responseTime,
      extraData,
      signature,
    } = req.body;

    // ✅ Bước 1: kiểm tra chữ ký hợp lệ
    const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Sai chữ ký Momo' });
    }

    // ✅ Bước 2: Nếu thành công, cập nhật đơn hàng (tuỳ DB của bạn)
    if (resultCode === 0) {
      console.log(`✅ Thanh toán thành công cho đơn ${orderId}`);
      // TODO: Update đơn hàng có orderId trong DB => status = 'paid'
    } else {
      console.warn(`⚠️ Giao dịch thất bại đơn ${orderId} - Momo code: ${resultCode}`);
    }

    res.status(200).json({ message: 'IPN received' });
  } catch (err) {
    console.error('IPN Momo lỗi:', err);
    res.status(500).json({ message: 'Lỗi xử lý IPN Momo' });
  }
};