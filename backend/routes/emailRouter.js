import express from 'express';
import { sendInvoiceEmail, testEmail } from '../controllers/emailController.js';

const emailRouter = express.Router();

// Test endpoint (public)
emailRouter.post('/test', testEmail);

// Gửi hóa đơn (public)
emailRouter.post('/send-invoice', sendInvoiceEmail);

export default emailRouter;
