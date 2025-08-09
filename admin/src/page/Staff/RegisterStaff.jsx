import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';

export default function RegisterStaff() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token'); // ✅ giống login

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/admin/register`,
        { ...form, role: 'staff' },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ giống login gửi token
          },
        }
      );
      setMessage('✅ Tạo tài khoản staff thành công!');
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.status === 403
          ? '❌ Bạn không có quyền tạo tài khoản.'
          : '❌ Lỗi tạo tài khoản');
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-green-700">
        Tạo tài khoản nhân viên (staff)
      </h2>

      {message && <p className="mb-4 text-sm text-red-500">{message}</p>}
      {loading && <p className="text-sm text-gray-500 mb-2">Đang xử lý...</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Tên nhân viên"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Mật khẩu"
          type="password"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
        </button>
      </form>
    </div>
  );
}
