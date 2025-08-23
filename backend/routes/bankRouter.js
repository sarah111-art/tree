// ✅ ROUTER: routes/bankRoutes.js

import express from 'express';
import { createBankOrder, getVNPayQRInfo } from '../controllers/bankController.js';

const bankRouter = express.Router();

// 📌 Tạo đơn hàng và trả về thông tin chuyển khoản
bankRouter.post('/create-order', createBankOrder);

// 📌 Lấy thông tin QR VNPay
bankRouter.get('/vnpay-qr', getVNPayQRInfo);

export default bankRouter;
