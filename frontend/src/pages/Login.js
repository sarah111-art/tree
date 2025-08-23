import React, { useState } from "react";
import axios from "axios";
import { backendUrl, useShop } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { validateEmail, validateSimplePassword } from "../utils/validation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUser } = useShop();

  const validateForm = () => {
    const newErrors = {};
    
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validateSimplePassword(password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (errors.email) {
      const emailError = validateEmail(value);
      setErrors(prev => ({
        ...prev,
        email: emailError || null
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (errors.password) {
      const passwordError = validateSimplePassword(value);
      setErrors(prev => ({
        ...prev,
        password: passwordError || null
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";
    
    switch (name) {
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validateSimplePassword(value);
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
    console.log("Đã nhấn nút đăng nhập");
    console.log("backendUrl:", backendUrl);

    try {
      const res = await axios.post(`${backendUrl}/api/users/login`, {
        email,
        password,
      });
      console.log("Phản hồi từ server:", res.data);

      const { token, user } = res.data;
      console.log("Token:", token);
      console.log("User:", user);
      setToken(token);
      setUser(user);
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      toast.error(
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/dang-ky");
  };

  const handleForgotPassword = () => {
    alert("Chuyển tới trang Quên mật khẩu");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        Đăng nhập tài khoản
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            onChange={handleEmailChange}
            onBlur={handleBlur}
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
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
              errors.password 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'focus:border-green-400 focus:ring-green-200'
            }`}
            value={password}
            onChange={handlePasswordChange}
            onBlur={handleBlur}
            placeholder="Nhập mật khẩu của bạn"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
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
            'Đăng nhập'
          )}
        </button>
      </form>

      <div className="mt-4 flex justify-between text-sm">
        <button
          onClick={handleRegister}
          className="text-green-600 hover:underline focus:outline-none"
          type="button"
        >
          Đăng ký
        </button>
        <button
          onClick={handleForgotPassword}
          className="text-green-600 hover:underline focus:outline-none"
          type="button"
        >
          Quên mật khẩu?
        </button>
      </div>
    </div>
  );
}
