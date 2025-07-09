import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không có token hoặc định dạng sai (Bearer)' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
      console.log('📦 Token nhận được:', token);
 // decoded sẽ chứa id, role, ...
    next();
  } catch (err) {
    console.error('Token verify error:', err);
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
