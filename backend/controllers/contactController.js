// controllers/contactController.js
import Contact from '../models/contactModel.js';
import nodemailer from 'nodemailer';
import { logActivity } from '../utils/LogActivity.js';
// Gửi liên hệ (người dùng)
export const createContact = async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ message: 'Gửi liên hệ thất bại', err });
  }
};

// Lấy danh sách liên hệ (admin) - hỗ trợ phân trang
export const getAllContacts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

    const filter = {};
    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: contacts,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', err });
  }
};

// Cập nhật trạng thái (admin)
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) return res.status(404).json({ message: 'Không tìm thấy liên hệ' });
    
    const { status } = req.body;
    const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    
    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id,
        action: 'Cập nhật trạng thái liên hệ',
        targetType: 'Contact',
        targetId: updated._id,
        metadata: { oldStatus: contact.status, newStatus: status }
      });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Cập nhật trạng thái thất bại', err });
  }
};
export const replyToContact = async (req, res) => {
  const { id } = req.params;
  const { replyMessage } = req.body;

  try {
    const contact = await Contact.findById(id);
    if (!contact) return res.status(404).json({ error: 'Không tìm thấy liên hệ' });

    // Gửi email phản hồi
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: contact.email,
      subject: 'Phản hồi từ cửa hàng Bonsai',
      text: replyMessage,
    });

    contact.status = 'processed';
    await contact.save();

    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id,
        action: 'Phản hồi liên hệ khách hàng',
        targetType: 'Contact',
        targetId: contact._id,
        metadata: { email: contact.email }
      });
    }

    res.json({ message: 'Đã gửi phản hồi' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi phản hồi' });
  }
};