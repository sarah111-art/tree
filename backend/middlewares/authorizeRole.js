export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('🔒 Kiểm tra quyền:', req.user?.role, 'Allowed:', allowedRoles);
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      console.log('❌ Không đủ quyền truy cập');
      return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
    }

    console.log('✅ Quyền hợp lệ');
    next();
  };
};