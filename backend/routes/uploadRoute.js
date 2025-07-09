import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bonsai',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const upload = multer({ storage });

// ✅ Upload 1 ảnh
router.post('/', (req, res) => {
  try {
    upload.single('image')(req, res, function (err) {
      if (err) {
        console.error("❌ Lỗi multer upload:", err);
        return res.status(500).json({ error: 'Upload lỗi', detail: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Không có file' });
      }

      return res.json({
        url: req.file.path || req.file?.secure_url,
        public_id: req.file?.filename || null,
      });
    });
  } catch (err) {
    console.error("❌ Lỗi server:", err);
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// ✅ Upload nhiều ảnh
router.post('/multiple', (req, res) => {
  try {
    upload.array('images', 10)(req, res, function (err) {
      if (err) {
        console.error("❌ Lỗi multer multiple upload:", err);
        return res.status(500).json({ error: 'Upload nhiều lỗi', detail: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Không có file nào' });
      }

      const urls = req.files.map(file => ({
        url: file.path || file.secure_url,
        public_id: file.filename || null,
        alt: file.originalname,
      }));

      return res.json(urls);
    });
  } catch (err) {
    console.error("❌ Lỗi server:", err);
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

export default router;
