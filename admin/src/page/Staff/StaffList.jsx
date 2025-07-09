import React, { useEffect, useState } from 'react';
import axios from '../../api';
import { backendUrl } from '../../App';

export default function StaffList() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/admin/staffs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStaffs(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi khi tải danh sách');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Danh sách nhân viên</h2>
      {loading && <p className="text-gray-500">Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && staffs.length === 0 && <p>Chưa có nhân viên nào.</p>}

      <ul className="space-y-2">
        {staffs.map((staff) => (
          <li key={staff._id} className="p-4 border rounded">
            <p className="font-semibold">{staff.name}</p>
            <p className="text-sm text-gray-600">{staff.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
