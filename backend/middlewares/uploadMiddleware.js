// middlewares/uploadMiddleware.js
import multer from 'multer';

const storage = multer.memoryStorage(); // lưu trên RAM để upload lên cloudinary
const upload = multer({ storage });

export default upload;
