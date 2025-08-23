// ✅ ROUTER: routes/vnpayRouter.js

import express from 'express';
import { createVNPayPayment, handleVNPayCallback, createVNPayQR } from '../controllers/vnpayController.js';

const vnpayRouter = express.Router();

// 📌 Route: Tạo yêu cầu thanh toán VNPay
vnpayRouter.post('/create-payment', createVNPayPayment);

// 📌 Route: Callback từ VNPay sau khi thanh toán
vnpayRouter.get('/callback', handleVNPayCallback);

// 📌 Route: Tạo QR code VNPay
vnpayRouter.post('/create-qr', createVNPayQR);

export default vnpayRouter;
