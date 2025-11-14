import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';

export default function StaffList() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStaff, setEditingStaff] = useState(null);
  const [editForm, setEditForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);
  const [deletingStaff, setDeletingStaff] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/admin/staffs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStaffs(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách');
      toast.error('Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (staff) => {
    setEditingStaff(staff._id);
    setEditForm({
      email: staff.email,
      password: '',
      confirmPassword: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingStaff(null);
    setEditForm({
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleSaveStaff = async (staffId) => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editForm.email || !emailRegex.test(editForm.email.trim())) {
      toast.error('Email không hợp lệ');
      return;
    }

    // Nếu có nhập mật khẩu mới, kiểm tra
    if (editForm.password) {
      if (editForm.password.length < 6) {
        toast.error('Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }
      if (editForm.password !== editForm.confirmPassword) {
        toast.error('Mật khẩu và xác nhận mật khẩu không khớp');
        return;
      }
    }

    setSaving(true);
    try {
      const updateData = {
        email: editForm.email.trim()
      };

      // Chỉ gửi password nếu có nhập
      if (editForm.password) {
        updateData.password = editForm.password;
      }

      const res = await axios.put(
        `${backendUrl}/api/admin/staffs/${staffId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Cập nhật thông tin nhân viên thành công!');
      setEditingStaff(null);
      setEditForm({
        email: '',
        password: '',
        confirmPassword: ''
      });
      fetchStaffs(); // Refresh danh sách
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật thông tin nhân viên');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStaff = async (staffId, staffName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${staffName}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    setDeletingStaff(staffId);
    try {
      await axios.delete(
        `${backendUrl}/api/admin/staffs/${staffId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Xóa nhân viên thành công!');
      fetchStaffs(); // Refresh danh sách
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi xóa nhân viên');
    } finally {
      setDeletingStaff(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Danh sách nhân viên</h2>
      {loading && <p className="text-gray-500">Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && staffs.length === 0 && (
        <p className="text-gray-500 text-center py-8">Chưa có nhân viên nào.</p>
      )}

      {!loading && staffs.length > 0 && (
        <div className="space-y-4">
          {staffs.map((staff) => (
            <div key={staff._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              {editingStaff === staff._id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên
                    </label>
                    <p className="font-semibold text-gray-800">{staff.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu mới (để trống nếu không đổi)
                    </label>
                    <input
                      type="password"
                      value={editForm.password}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={saving}
                      placeholder="Nhập mật khẩu mới..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
                  </div>

                  {editForm.password && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={editForm.confirmPassword}
                        onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={saving}
                        placeholder="Nhập lại mật khẩu mới..."
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleSaveStaff(staff._id)}
                      disabled={saving}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {saving ? 'Đang lưu...' : 'Lưu'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{staff.name}</p>
                    <p className="text-sm text-gray-600 mt-1">📧 {staff.email}</p>
                    {staff.phone && (
                      <p className="text-sm text-gray-600">📞 {staff.phone}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Ngày tạo: {new Date(staff.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(staff)}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(staff._id, staff.name)}
                      disabled={deletingStaff === staff._id}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      {deletingStaff === staff._id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
