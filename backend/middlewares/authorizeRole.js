
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
    }

    next();
  };
};
