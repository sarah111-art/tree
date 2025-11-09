import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
 console.log('🔑 Authorization header:', authHeader);
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
// middleware auth.js
export const requireAdmin = (req, res, next) => {
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).json({ message: 'Không có token' });

  try {
    const data = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = data;
    if (!['manager', 'staff'].includes(data.role)) {
      return res.status(403).json({ message: 'Không đủ quyền' });
    }
    next();
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

// Middleware tùy chọn: parse token nếu có, không bắt buộc
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log('✅ Optional auth: Token parsed:', decoded.email);
    } catch (err) {
      console.log('⚠️ Optional auth: Invalid token');
    }
  }
  next();
};