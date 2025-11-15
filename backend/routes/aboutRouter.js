import express from 'express';
import {
  getAllAbouts,
  getActiveAbout,
  getAboutById,
  createAbout,
  updateAbout,
  deleteAbout
} from '../controllers/aboutController.js';
import { optionalAuth, authenticate } from '../middlewares/auth.js';
import { requireAdmin } from '../middlewares/auth.js';

const aboutRouter = express.Router();

// Public route - lấy phần giới thiệu active cho frontend
aboutRouter.get('/active', getActiveAbout);

// Admin routes
aboutRouter.get('/', optionalAuth, getAllAbouts);
aboutRouter.get('/:id', optionalAuth, getAboutById);
aboutRouter.post('/', authenticate, requireAdmin, createAbout);
aboutRouter.put('/:id', authenticate, requireAdmin, updateAbout);
aboutRouter.delete('/:id', authenticate, requireAdmin, deleteAbout);

export default aboutRouter;

