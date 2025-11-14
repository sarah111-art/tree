import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tieude1 from '../assets/tieude1.jpg';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation cơ bản
    if (!email.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }
    if (!password.trim()) {
      toast.error('Vui lòng nhập mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('https://tree-mmpq.onrender.com/api/users/login', {
        email: email.trim(),
        password,
      });
      
      const { token, user } = res.data;

      if (user.role === 'manager' || user.role === 'staff') {
        localStorage.setItem('token', token);
        localStorage.setItem('adminInfo', JSON.stringify(user));
        // Cập nhật state token trong App.jsx để tránh redirect về login
        if (setToken) {
          setToken(token);
        }
        
        toast.success(`Đăng nhập thành công! Chào mừng ${user.name}`);
        
        // Đợi một chút để đảm bảo state đã được cập nhật trước khi navigate
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 500);
      } else {
        toast.error('Bạn không có quyền truy cập trang admin. Chỉ tài khoản manager hoặc staff mới được phép.');
      }
    } catch (err) {
      // Xử lý các loại lỗi khác nhau
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 404) {
        toast.error('Email không tồn tại trong hệ thống');
      } else if (status === 401) {
        toast.error('Mật khẩu không đúng. Vui lòng kiểm tra lại.');
      } else if (status === 403) {
        toast.error('Bạn không có quyền truy cập');
      } else if (status === 500) {
        toast.error('Lỗi server. Vui lòng thử lại sau.');
      } else if (err.message === 'Network Error' || err.code === 'ECONNABORTED') {
        toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        toast.error(message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${tieude1})`
      }}
    >
      {/* Overlay để làm form dễ đọc hơn */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-lg w-full max-w-sm relative z-10 backdrop-blur-sm bg-opacity-95"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}
