// utils/validation.js

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email không được để trống";
  if (!emailRegex.test(email)) return "Email không hợp lệ";
  return "";
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return "Mật khẩu không được để trống";
  if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
  if (password.length > 20) return "Mật khẩu không được quá 20 ký tự";
  if (!/(?=.*[a-z])/.test(password)) return "Mật khẩu phải có ít nhất 1 chữ thường";
  if (!/(?=.*[A-Z])/.test(password)) return "Mật khẩu phải có ít nhất 1 chữ hoa";
  if (!/(?=.*\d)/.test(password)) return "Mật khẩu phải có ít nhất 1 số";
  return "";
};

// Simple password validation (for login)
export const validateSimplePassword = (password) => {
  if (!password) return "Mật khẩu không được để trống";
  if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
  return "";
};

// Name validation
export const validateName = (name) => {
  if (!name.trim()) return "Họ tên không được để trống";
  if (name.trim().length < 2) return "Họ tên phải có ít nhất 2 ký tự";
  if (name.trim().length > 50) return "Họ tên không được quá 50 ký tự";
  return "";
};

// Phone validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phone) return "Số điện thoại không được để trống";
  if (!phoneRegex.test(phone)) return "Số điện thoại không hợp lệ";
  return "";
};

// Address validation
export const validateAddress = (address) => {
  if (!address.trim()) return "Địa chỉ không được để trống";
  if (address.trim().length < 10) return "Địa chỉ phải có ít nhất 10 ký tự";
  return "";
};

// Confirm password validation
export const validateConfirmPassword = (confirmPassword, password) => {
  if (!confirmPassword) return "Xác nhận mật khẩu không được để trống";
  if (confirmPassword !== password) return "Mật khẩu xác nhận không khớp";
  return "";
};

// Amount validation
export const validateAmount = (amount) => {
  if (!amount || amount <= 0) return "Số tiền phải lớn hơn 0";
  if (amount > 1000000000) return "Số tiền không được quá 1 tỷ VND";
  return "";
};

// Order ID validation
export const validateOrderId = (orderId) => {
  if (!orderId) return "Mã đơn hàng không được để trống";
  if (orderId.length < 5) return "Mã đơn hàng phải có ít nhất 5 ký tự";
  return "";
};

// Product name validation
export const validateProductName = (name) => {
  if (!name.trim()) return "Tên sản phẩm không được để trống";
  if (name.trim().length < 3) return "Tên sản phẩm phải có ít nhất 3 ký tự";
  if (name.trim().length > 100) return "Tên sản phẩm không được quá 100 ký tự";
  return "";
};

// Price validation
export const validatePrice = (price) => {
  if (!price || price <= 0) return "Giá sản phẩm phải lớn hơn 0";
  if (price > 1000000000) return "Giá sản phẩm không được quá 1 tỷ VND";
  return "";
};

// Quantity validation
export const validateQuantity = (quantity) => {
  if (!quantity || quantity <= 0) return "Số lượng phải lớn hơn 0";
  if (quantity > 1000) return "Số lượng không được quá 1000";
  return "";
};

// Category validation
export const validateCategory = (category) => {
  if (!category) return "Danh mục không được để trống";
  return "";
};

// Description validation
export const validateDescription = (description) => {
  if (!description.trim()) return "Mô tả không được để trống";
  if (description.trim().length < 10) return "Mô tả phải có ít nhất 10 ký tự";
  if (description.trim().length > 1000) return "Mô tả không được quá 1000 ký tự";
  return "";
};

// Image URL validation
export const validateImageUrl = (url) => {
  if (!url) return "URL hình ảnh không được để trống";
  const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
  if (!urlRegex.test(url)) return "URL hình ảnh không hợp lệ";
  return "";
};

// Generic form validation
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const validationFn = validationRules[field];
    
    if (typeof validationFn === 'function') {
      const error = validationFn(value, formData);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return errors;
};

// Check if form is valid
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

// Format validation error message
export const formatValidationError = (errors) => {
  return Object.values(errors).join(', ');
};
