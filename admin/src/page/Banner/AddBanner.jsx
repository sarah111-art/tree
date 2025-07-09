import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';

export default function AddBanner() {
  const [banners, setBanners] = useState([]);
const [form, setForm] = useState({
  title: '',
  description: '',
  image: '',
  link: '',
  status: 'active',
  position: 'homepage',
  startDate: '', // ← thêm
  endDate: '',   // ← thêm
});

  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const res = await axios.get(`${backendUrl}/api/banners`);
    setBanners(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    const res = await axios.post(`${backendUrl}/api/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setForm((prev) => ({ ...prev, image: res.data.url }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.image) {
    alert("❌ Bạn chưa upload ảnh banner!");
    return;
  }

  try {
    if (editing) {
      await axios.put(`${backendUrl}/api/banners/${editing._id}`, form);
    } else {
      await axios.post(`${backendUrl}/api/banners`, form);
    }

    setForm({
      title: '',
      description: '',
      image: '',
      link: '',
      status: 'active',
      position: 'homepage',
      startDate: '',
      endDate: '',
    });
    setEditing(null);
    fetchBanners();
  } catch (err) {
    console.error("❌ Lỗi khi gửi banner:", err.response?.data || err);
    alert("❌ Không thể tạo/cập nhật banner!");
  }
};

  const handleEdit = (banner) => {
    setForm(banner);
    setEditing(banner);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xoá banner này?')) {
      await axios.delete(`${backendUrl}/api/banners/${id}`);
      fetchBanners();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">🖼️ Quản lý Banner</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 border rounded shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Tiêu đề"
            className="border p-2 rounded"
            required
          />
          <input
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="Liên kết (URL)"
            className="border p-2 rounded"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="active">Hiển thị</option>
            <option value="inactive">Ẩn</option>
          </select>
          <select
            name="position"
            value={form.position}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="homepage">Trang chủ</option>
            <option value="sidebar">Sidebar</option>
            <option value="footer">Footer</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 rounded"
          />
                    <input
            type="date"
            value={form.startDate?.slice(0, 10) || ''}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />

          <input
            type="date"
            value={form.endDate?.slice(0, 10) || ''}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />

        </div>
        {form.image && <img src={form.image} alt="Banner" className="w-40 h-24 object-cover rounded" />}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Mô tả"
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {editing ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>

      {/* Danh sách banner */}
      <table className="w-full text-sm border shadow mt-6">
        <thead className="bg-green-100">
          <tr>
            <th className="p-2 border">Hình ảnh</th>
            <th className="p-2 border">Tiêu đề</th>
            <th className="p-2 border">Vị trí</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Hành động</th>
            <th className="p-2 border">Thời gian</th>

          </tr>
        </thead>
        <tbody>
          {banners.map((b) => (
            <tr key={b._id} className="hover:bg-gray-50">
              <td className="p-2 border">
                <img src={b.image} alt="banner" className="w-28 h-14 object-cover" />
              </td>
              <td className="p-2 border">{b.title}</td>
              <td className="p-2 border">{b.position}</td>
              <td className="p-2 border">
                {b.status === 'active' ? '✅ Hiển thị' : '❌ Ẩn'}
              </td>
              <td className="p-2 border space-x-2">
                <button className="text-blue-600" onClick={() => handleEdit(b)}>✏️ Sửa</button>
                <button className="text-red-600" onClick={() => handleDelete(b._id)}>🗑️ Xoá</button>
              </td>
              <td className="p-2 border text-sm">
              {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
