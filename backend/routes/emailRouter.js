import express from 'express';
import { sendInvoiceEmail } from '../controllers/emailController.js';

const emailRouter = express.Router();

emailRouter.post('/send-invoice', sendInvoiceEmail);

export default emailRouter;
