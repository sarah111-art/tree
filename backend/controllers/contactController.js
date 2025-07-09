// controllers/contactController.js
import Contact from '../models/contactModel.js';
import nodemailer from 'nodemailer';
// Gửi liên hệ (người dùng)
export const createContact = async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ message: 'Gửi liên hệ thất bại', err });
  }
};

// Lấy danh sách liên hệ (admin)
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', err });
  }
};

// Cập nhật trạng thái (admin)
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
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

    res.json({ message: 'Đã gửi phản hồi' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi phản hồi' });
  }
};