import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  validateName, 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword 
} from "../utils/validation";
import { backendUrl } from "../context/ShopContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = validateName(form.name);
    if (nameError) newErrors.name = nameError;
    
    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(form.confirmPassword, form.password);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";
    
    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(value, form.password);
        break;
      default:
        break;
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = form;
      const res = await axios.post(`${backendUrl}/api/users/register`, registerData);
      toast.success("Đăng ký thành công!");
      navigate("/dang-nhap");
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        Đăng ký tài khoản
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Họ tên
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
              errors.name 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'focus:border-green-400 focus:ring-green-200'
            }`}
            placeholder="Nhập họ tên của bạn"
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
              errors.email 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'focus:border-green-400 focus:ring-green-200'
            }`}
            placeholder="Nhập email của bạn"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block font-medium mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
              errors.password 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'focus:border-green-400 focus:ring-green-200'
            }`}
            placeholder="Nhập mật khẩu (6-20 ký tự)"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block font-medium mb-1">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
              errors.confirmPassword 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'focus:border-green-400 focus:ring-green-200'
            }`}
            placeholder="Nhập lại mật khẩu"
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

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
            'Đăng ký'
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <button
            onClick={() => navigate("/dang-nhap")}
            className="text-green-600 hover:underline focus:outline-none"
            type="button"
          >
            Đăng nhập ngay
          </button>
        </p>
      </div>
    </div>
  );
}
