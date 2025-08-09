import express from 'express';
import { getActivityLogs } from '../controllers/activityController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
const activityRouter = express.Router();


activityRouter.get('/admin/activity-logs', authenticate, authorizeRole('manager'), getActivityLogs);

export default activityRouter;
