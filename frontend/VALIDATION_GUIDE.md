# 🚀 Hướng dẫn sử dụng Validation System

## 📋 Tổng quan

Hệ thống validation đã được tích hợp vào các form đăng nhập và đăng ký với các tính năng:

- ✅ **Real-time validation** - Kiểm tra ngay khi người dùng nhập
- ✅ **Blur validation** - Kiểm tra khi người dùng rời khỏi field
- ✅ **Submit validation** - Kiểm tra toàn bộ form trước khi gửi
- ✅ **Visual feedback** - Hiển thị lỗi với màu sắc và icon
- ✅ **Loading states** - Hiển thị trạng thái đang xử lý

## 🎯 Validation Rules

### 📧 Email Validation
```javascript
import { validateEmail } from '../utils/validation';

// Rules:
// - Không được để trống
// - Phải có định dạng email hợp lệ (user@domain.com)
```

### 🔐 Password Validation (Đăng ký)
```javascript
import { validatePassword } from '../utils/validation';

// Rules:
// - Không được để trống
// - 6-20 ký tự
// - Ít nhất 1 chữ thường
// - Ít nhất 1 chữ hoa  
// - Ít nhất 1 số
```

### 🔑 Simple Password Validation (Đăng nhập)
```javascript
import { validateSimplePassword } from '../utils/validation';

// Rules:
// - Không được để trống
// - Ít nhất 6 ký tự
```

### 👤 Name Validation
```javascript
import { validateName } from '../utils/validation';

// Rules:
// - Không được để trống
// - 2-50 ký tự
```

### 📱 Phone Validation
```javascript
import { validatePhone } from '../utils/validation';

// Rules:
// - Không được để trống
// - 10-11 số
// - Chỉ chứa số
```

### 🏠 Address Validation
```javascript
import { validateAddress } from '../utils/validation';

// Rules:
// - Không được để trống
// - Ít nhất 10 ký tự
```

## 🔧 Cách sử dụng

### 1. Import validation functions
```javascript
import { 
  validateEmail, 
  validatePassword, 
  validateName,
  validateForm,
  isFormValid 
} from '../utils/validation';
```

### 2. Setup state cho errors
```javascript
const [errors, setErrors] = useState({});
```

### 3. Tạo validation function
```javascript
const validateForm = () => {
  const newErrors = {};
  
  const emailError = validateEmail(email);
  if (emailError) newErrors.email = emailError;
  
  const passwordError = validatePassword(password);
  if (passwordError) newErrors.password = passwordError;
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### 4. Handle input changes
```javascript
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
  
  // Clear error when user starts typing
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: null }));
  }
};
```

### 5. Handle blur events
```javascript
const handleBlur = (e) => {
  const { name, value } = e.target;
  let error = "";
  
  switch (name) {
    case "email":
      error = validateEmail(value);
      break;
    case "password":
      error = validatePassword(value);
      break;
  }
  
  if (error) {
    setErrors(prev => ({ ...prev, [name]: error }));
  }
};
```

### 6. Handle form submit
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    toast.error("Vui lòng kiểm tra lại thông tin!");
    return;
  }
  
  // Proceed with form submission
};
```

## 🎨 UI Components

### Input Field với Error
```jsx
<div>
  <label htmlFor="email" className="block font-medium mb-1">
    Email
  </label>
  <input
    type="email"
    id="email"
    name="email"
    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
      errors.email 
        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
        : 'focus:border-green-400 focus:ring-green-200'
    }`}
    value={email}
    onChange={handleChange}
    onBlur={handleBlur}
    placeholder="Nhập email của bạn"
    required
  />
  {errors.email && (
    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
  )}
</div>
```

### Button với Loading State
```jsx
<button
  type="submit"
  disabled={loading}
  className={`w-full py-2 px-4 rounded transition ${
    loading
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-green-600 hover:bg-green-700 text-white'
  }`}
>
  {loading ? (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      Đang xử lý...
    </div>
  ) : (
    'Đăng nhập'
  )}
</button>
```

## 📱 Responsive Design

### Mobile-friendly validation
- Error messages hiển thị rõ ràng trên mobile
- Touch-friendly input fields
- Proper spacing cho error messages

### Desktop optimization
- Hover effects cho input fields
- Focus states với ring effects
- Smooth transitions

## 🔐 Security Features

### Client-side validation
- Ngăn chặn gửi form với dữ liệu không hợp lệ
- Giảm tải cho server
- UX tốt hơn với immediate feedback

### Server-side validation
- Luôn validate lại trên server
- Bảo mật dữ liệu
- Prevent malicious requests

## 🧪 Testing

### Test validation rules
```javascript
// Test email validation
console.log(validateEmail("")); // "Email không được để trống"
console.log(validateEmail("invalid")); // "Email không hợp lệ"
console.log(validateEmail("test@example.com")); // ""

// Test password validation
console.log(validatePassword("123")); // "Mật khẩu phải có ít nhất 6 ký tự"
console.log(validatePassword("password")); // "Mật khẩu phải có ít nhất 1 chữ hoa"
console.log(validatePassword("Password123")); // ""
```

### Test form validation
```javascript
const formData = {
  email: "test@example.com",
  password: "Password123"
};

const validationRules = {
  email: validateEmail,
  password: validatePassword
};

const errors = validateForm(formData, validationRules);
console.log(isFormValid(errors)); // true/false
```

## 🚀 Best Practices

### 1. Consistent Error Messages
- Sử dụng cùng format cho tất cả error messages
- Ngắn gọn và dễ hiểu
- Hướng dẫn cụ thể cách sửa lỗi

### 2. User Experience
- Clear errors khi user bắt đầu nhập
- Validate on blur để không làm phiền user
- Loading states để user biết form đang xử lý

### 3. Performance
- Debounce validation cho real-time checking
- Lazy load validation rules
- Optimize re-renders với useCallback

### 4. Accessibility
- Proper ARIA labels
- Error messages linked to inputs
- Keyboard navigation support

## 📞 Troubleshooting

### Lỗi thường gặp
1. **Validation không hoạt động** → Kiểm tra import paths
2. **Error messages không hiển thị** → Kiểm tra CSS classes
3. **Form submit khi có lỗi** → Kiểm tra validateForm() return value
4. **Performance issues** → Sử dụng debounce cho real-time validation

### Debug tips
```javascript
// Log validation errors
console.log('Form errors:', errors);

// Log validation results
console.log('Is form valid:', isFormValid(errors));

// Log individual field validation
console.log('Email error:', validateEmail(email));
```
