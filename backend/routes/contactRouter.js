import express from 'express';
import {
  createContact,
  getAllContacts,
  replyToContact,
  updateContactStatus,
} from '../controllers/contactController.js';

const contactRouter = express.Router();

contactRouter.post('/', createContact); // Người dùng gửi liên hệ
contactRouter.get('/', getAllContacts); // Admin xem danh sách
contactRouter.put('/:id', updateContactStatus); // Admin xử lý liên hệ
contactRouter.post('/:id/reply', replyToContact);

export default contactRouter;
