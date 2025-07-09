// routes/qrRoutes.js
import express from 'express';
import { getAllQR, uploadOrUpdateQR } from '../controllers/qrController.js';

const qrRouter = express.Router();

qrRouter.get('/', getAllQR);
qrRouter.post('/', uploadOrUpdateQR); // POST body: { type: 'momo', imageUrl: '...' }

export default qrRouter;
