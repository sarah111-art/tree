import express from 'express';
import { createMomoPayment, createMomoQR, handleMomoIPN } from '../controllers/momoController.js';

const momoRouter = express.Router();

// 📌 Route: Tạo yêu cầu thanh toán Momo
momoRouter.post('/create-payment', createMomoPayment);

// 📌 Route: Tạo QR code động cho Momo
momoRouter.post('/create-qr', createMomoQR);

// 📌 Route: IPN callback từ Momo
momoRouter.post('/ipn', handleMomoIPN);

export default momoRouter;