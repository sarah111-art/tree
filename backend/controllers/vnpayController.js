// ✅ CONTROLLER: controllers/vnpayController.js

import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// 📌 Tạo yêu cầu thanh toán VNPay
export const createVNPayPayment = async (req, res) => {
  try {
    const { amount, orderId, orderInfo, redirectUrl } = req.body;

    const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
    const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
    const vnp_Url = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const vnp_ReturnUrl = redirectUrl || process.env.VNPAY_RETURN_URL;

    const date = new Date();
    const createDate = date.toISOString().split('T')[0].split('-').join('');

    const orderType = 'billpayment';
    const locale = 'vn';
    const currCode = 'VND';
    const vnp_Params = {};

    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = vnp_TmnCode;
    vnp_Params['vnp_Amount'] = amount * 100; // VNPay yêu cầu số tiền nhân 100
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_BankCode'] = '';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_ReturnUrl'] = vnp_ReturnUrl;
    vnp_Params['vnp_IpAddr'] = req.ip;
    vnp_Params['vnp_CreateDate'] = createDate;

    // Sắp xếp các tham số theo thứ tự a-z
    const sortedParams = Object.keys(vnp_Params).sort().reduce((result, key) => {
      result[key] = vnp_Params[key];
      return result;
    }, {});

    // Tạo chuỗi hash data
    const signData = Object.keys(sortedParams).map(key => {
      return `${key}=${sortedParams[key]}`;
    }).join('&');

    // Tạo chữ ký
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    // Tạo URL thanh toán
    const paymentUrl = `${vnp_Url}?${Object.keys(vnp_Params).map(key => {
      return `${key}=${encodeURIComponent(vnp_Params[key])}`;
    }).join('&')}`;

    res.json({
      resultCode: 0,
      message: 'Tạo thanh toán VNPay thành công',
      payUrl: paymentUrl,
      orderId: orderId
    });
  } catch (err) {
    console.error('VNPay error:', err);
    res.status(500).json({ message: 'Lỗi tạo thanh toán VNPay', error: err.message });
  }
};

// 📌 Xử lý callback từ VNPay
export const handleVNPayCallback = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    // Xóa vnp_SecureHash và vnp_SecureHashType khỏi params
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp các tham số theo thứ tự a-z
    const sortedParams = Object.keys(vnp_Params).sort().reduce((result, key) => {
      result[key] = vnp_Params[key];
      return result;
    }, {});

    // Tạo chuỗi hash data
    const signData = Object.keys(sortedParams).map(key => {
      return `${key}=${sortedParams[key]}`;
    }).join('&');

    // Tạo chữ ký
    const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
    const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');

    // Kiểm tra chữ ký
    if (secureHash === signed) {
      const orderId = vnp_Params['vnp_TxnRef'];
      const rspCode = vnp_Params['vnp_ResponseCode'];
      const amount = vnp_Params['vnp_Amount'] / 100; // Chia 100 để lấy số tiền thực
      const transId = vnp_Params['vnp_TransactionNo'];

      if (rspCode === '00') {
        console.log(`✅ Thanh toán VNPay thành công cho đơn ${orderId}`);
        
        try {
          // Import Order model
          const Order = (await import('../models/orderModel.js')).default;
          
          // Cập nhật trạng thái đơn hàng
          const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            { 
              status: 'paid',
              paymentMethod: 'vnpay',
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

        // Redirect về trang thành công
        res.redirect(`${process.env.FRONTEND_URL}/payment-success?resultCode=0&orderId=${orderId}&transId=${transId}&message=Thanh toán thành công`);
      } else {
        console.warn(`⚠️ Giao dịch VNPay thất bại đơn ${orderId} - Code: ${rspCode}`);
        res.redirect(`${process.env.FRONTEND_URL}/payment-success?resultCode=${rspCode}&orderId=${orderId}&message=Thanh toán thất bại`);
      }
    } else {
      console.error('❌ Sai chữ ký VNPay');
      res.redirect(`${process.env.FRONTEND_URL}/payment-success?resultCode=99&message=Sai chữ ký`);
    }
  } catch (err) {
    console.error('VNPay callback error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/payment-success?resultCode=99&message=Lỗi xử lý callback`);
  }
};

// 📌 Tạo QR code VNPay
export const createVNPayQR = async (req, res) => {
  try {
    const { amount, orderId, orderInfo } = req.body;

    const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
    const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
    const vnp_Url = process.env.VNPAY_QR_URL || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction';

    const date = new Date();
    const createDate = date.toISOString().split('T')[0].split('-').join('');

    const vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = vnp_TmnCode;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = 'billpayment';
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_IpAddr'] = req.ip;

    // Sắp xếp và tạo chữ ký
    const sortedParams = Object.keys(vnp_Params).sort().reduce((result, key) => {
      result[key] = vnp_Params[key];
      return result;
    }, {});

    const signData = Object.keys(sortedParams).map(key => {
      return `${key}=${sortedParams[key]}`;
    }).join('&');

    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    // Gọi API VNPay để tạo QR
    const response = await axios.post(vnp_Url, vnp_Params, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.vnp_ResponseCode === '00') {
      res.json({
        resultCode: 0,
        message: 'Tạo QR VNPay thành công',
        qrCode: response.data.vnp_QRCode,
        orderId: orderId
      });
    } else {
      res.status(400).json({
        resultCode: response.data.vnp_ResponseCode,
        message: response.data.vnp_Message || 'Lỗi tạo QR VNPay'
      });
    }
  } catch (err) {
    console.error('VNPay QR error:', err);
    res.status(500).json({ message: 'Lỗi tạo QR VNPay', error: err.message });
  }
};
