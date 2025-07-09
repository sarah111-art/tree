// ✅ ROUTER: routes/bankRoutes.js

import express from 'express';
import { createBankOrder } from '../controllers/bankController.js';

const bankRouter = express.Router();

// 📌 Tạo đơn hàng và trả về thông tin chuyển khoản
bankRouter.post('/create-order', createBankOrder);

export default bankRouter;
