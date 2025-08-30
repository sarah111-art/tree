// routes/cassoRouter.js
import express from 'express';
import { 
  handleCassoWebhook, 
  checkPaymentStatus, 
  createPaymentQR 
} from '../controllers/cassoController.js';

const router = express.Router();

// Webhook từ Casso (không cần auth)
router.post('/webhook', handleCassoWebhook);

// Check trạng thái thanh toán
router.get('/check-payment/:orderId', checkPaymentStatus);

// Tạo QR thanh toán động
router.post('/create-qr', createPaymentQR);

export default router;
