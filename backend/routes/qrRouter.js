// routes/qrRoutes.js
import express from 'express';
import { getAllQR, uploadOrUpdateQR, getMomoQR, getVNPayQR } from '../controllers/qrController.js';

const qrRouter = express.Router();

qrRouter.get('/', getAllQR);
qrRouter.get('/momo', getMomoQR);
qrRouter.get('/vnpay', getVNPayQR);
qrRouter.post('/', uploadOrUpdateQR); // POST body: { type: 'vnpay', imageUrl: '...', bankCode: '...', accountNumber: '...' }

export default qrRouter;
