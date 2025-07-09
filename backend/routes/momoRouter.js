import express from 'express';
import { createMomoPayment } from '../controllers/momoController.js';
import { handleMomoIPN } from '../controllers/momoController.js';

const momoRouter = express.Router();

// 📌 Route: Gửi yêu cầu thanh toán đến Momo
momoRouter.post('/create-payment', createMomoPayment);
momoRouter.post('/ipn', handleMomoIPN); 
export default momoRouter;