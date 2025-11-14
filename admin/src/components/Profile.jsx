import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

export default function Profile() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('adminInfo');
    return stored ? JSON.parse(stored) : null;
  });
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (!newName) setNewName(user.name || '');
      if (!newEmail) setNewEmail(user.email || '');
    }
  }, [user]);

  if (!user) return <p className="text-center mt-10">Không tìm thấy người dùng.</p>;

  const token = localStorage.getItem('token');

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      toast.error('Tên không được để trống');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${backendUrl}/api/users/profile`,
        { name: newName.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Cập nhật thông tin user trong localStorage
      const updatedUser = { ...user, name: res.data.user.name };
      localStorage.setItem('adminInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditingName(false);
      toast.success('Cập nhật tên thành công!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật tên');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail.trim()) {
      toast.error('Email không được để trống');
      return;
    }
    if (!emailRegex.test(newEmail.trim())) {
      toast.error('Email không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${backendUrl}/api/users/profile`,
        { email: newEmail.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Cập nhật thông tin user trong localStorage
      const updatedUser = { ...user, email: res.data.user.email };
      localStorage.setItem('adminInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditingEmail(false);
      toast.success('Cập nhật email thành công!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật email');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${backendUrl}/api/users/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setChangingPassword(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Thông tin tài khoản</h2>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Thông tin cơ bản */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">👤</span>
              <div>
                <p className="text-sm text-gray-500">Tên</p>
                {editingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={loading}
                    />
                    <button
                      onClick={handleUpdateName}
                      disabled={loading}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingName(false);
                        setNewName(user.name || '');
                      }}
                      disabled={loading}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <p className="font-semibold text-gray-800">{user.name}</p>
                )}
              </div>
            </div>
            {!editingName && (
              <button
                onClick={() => setEditingName(true)}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Sửa
              </button>
            )}
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">📧</span>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                {editingEmail ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={loading}
                    />
                    <button
                      onClick={handleUpdateEmail}
                      disabled={loading}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingEmail(false);
                        setNewEmail(user.email || '');
                      }}
                      disabled={loading}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <p className="font-semibold text-gray-800">{user.email}</p>
                )}
              </div>
            </div>
            {!editingEmail && (
              <button
                onClick={() => setEditingEmail(true)}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Sửa
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 border-b pb-4">
            <span className="text-xl">🔐</span>
            <div>
              <p className="text-sm text-gray-500">Vai trò</p>
              <span className={`inline-block mt-1 px-2 py-0.5 text-sm rounded ${user.role === 'manager' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xl">🕓</span>
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="font-semibold text-gray-800">
                {new Date(user.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

        {/* Đổi mật khẩu */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Đổi mật khẩu</h3>
            {!changingPassword && (
              <button
                onClick={() => setChangingPassword(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Đổi mật khẩu
              </button>
            )}
          </div>

          {changingPassword && (
            <div className="space-y-4 bg-gray-50 p-4 rounded">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
                <button
                  onClick={() => {
                    setChangingPassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
