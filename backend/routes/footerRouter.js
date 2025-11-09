import express from 'express';
import {
  getAllFooters,
  getActiveFooter,
  createFooter,
  updateFooter,
  deleteFooter,
} from '../controllers/footerController.js';
import { optionalAuth } from '../middlewares/auth.js';

const footerRouter = express.Router();

// Public route - lấy footer active cho frontend
footerRouter.get('/active', getActiveFooter);

// Admin routes
footerRouter.get('/', optionalAuth, getAllFooters);
footerRouter.post('/', optionalAuth, createFooter);
footerRouter.put('/:id', optionalAuth, updateFooter);
footerRouter.delete('/:id', optionalAuth, deleteFooter);

export default footerRouter;
