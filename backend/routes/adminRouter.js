// routes/adminRoute.js
import express from 'express';
import { authenticate } from '../middlewares/auth.js'
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { getAllStaffs, registerStaff, updateStaff, deleteStaff } from '../controllers/adminController.js';

const adminRouter = express.Router();

// Chỉ manager mới được tạo staff
adminRouter.post('/admin/register', authenticate, authorizeRole('manager'), registerStaff);
adminRouter.get('/admin/staffs', authenticate, authorizeRole('manager'), getAllStaffs);
adminRouter.put('/admin/staffs/:staffId', authenticate, authorizeRole('manager'), updateStaff);
adminRouter.delete('/admin/staffs/:staffId', authenticate, authorizeRole('manager'), deleteStaff);
export default adminRouter;
