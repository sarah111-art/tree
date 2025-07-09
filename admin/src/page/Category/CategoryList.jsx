import React, { useEffect, useState } from 'react';
import api from '../../api';
import { backendUrl } from '../../App';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    parent: '',
    isFeatured: false,
    status: 'active',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get(`${backendUrl}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Lỗi khi load categories:', err.message);
      showMessage('❌ Lỗi khi tải danh mục', 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      metaKeywords: form.metaKeywords
        .split(',')
        .map((kw) => kw.trim())
        .filter(Boolean),
    };
    try {
      if (editing) {
        await api.put(`${backendUrl}/api/categories/${editing._id}`, payload);
        setEditing(null);
        showMessage('✅ Cập nhật danh mục thành công');
      } else {
        await api.post(`${backendUrl}/api/categories`, payload);
        showMessage('✅ Thêm danh mục thành công');
      }
      setForm({
        name: '',
        description: '',
        image: '',
        parent: '',
        isFeatured: false,
        status: 'active',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
      });
      fetchCategories();
    } catch (err) {
      console.error('Lỗi gửi dữ liệu:', err);
      showMessage('❌ Gửi dữ liệu thất bại', 'error');
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      parent: cat.parent || '',
      isFeatured: cat.isFeatured || false,
      status: cat.status || 'active',
      metaTitle: cat.metaTitle || '',
      metaDescription: cat.metaDescription || '',
      metaKeywords: (cat.metaKeywords || []).join(', '),
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá danh mục này?')) {
      try {
        await api.delete(`${backendUrl}/api/categories/${id}`);
        fetchCategories();
        showMessage('🗑️ Xoá danh mục thành công');
      } catch (err) {
        console.error('Xoá thất bại:', err.message);
        showMessage('❌ Xoá danh mục thất bại', 'error');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post(`${backendUrl}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({ ...form, image: res.data.url });
      showMessage('📷 Ảnh đã được tải lên');
    } catch (err) {
      console.error('Lỗi upload ảnh:', err);
      showMessage('❌ Upload ảnh thất bại', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">📂 Danh sách danh mục</h2>

      {message && (
        <div
          className={`p-3 rounded text-sm ${
            messageType === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 bg-white border p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Tên danh mục"
            required
            className="border p-2 rounded w-full"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 rounded w-full"
          />

          {form.image && (
            <img
              src={form.image}
              alt="Preview"
              className="w-24 h-24 object-cover rounded"
            />
          )}

          <select
            name="parent"
            value={form.parent}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            disabled={categories.length === 0}
          >
            <option value="">
              {categories.length === 0
                ? "-- Chưa có danh mục để chọn --"
                : "-- Danh mục cha (tuỳ chọn) --"}
            </option>
            {categories
              .filter((cat) => !editing || cat._id !== editing._id)
              .map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>

          <input
            name="metaTitle"
            value={form.metaTitle}
            onChange={handleChange}
            placeholder="Meta Title"
            className="border p-2 rounded w-full"
          />
          <input
            name="metaKeywords"
            value={form.metaKeywords}
            onChange={handleChange}
            placeholder="Meta Keywords (cách nhau dấu ,)"
            className="border p-2 rounded w-full"
          />
        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Mô tả"
          className="border p-2 rounded w-full"
        />
        <textarea
          name="metaDescription"
          value={form.metaDescription}
          onChange={handleChange}
          placeholder="Meta Description"
          className="border p-2 rounded w-full"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
          />
          Hiển thị nổi bật
        </label>
        <div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            {editing ? 'Cập nhật' : 'Thêm mới'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({
                  name: '',
                  description: '',
                  image: '',
                  parent: '',
                  isFeatured: false,
                  status: 'active',
                  metaTitle: '',
                  metaDescription: '',
                  metaKeywords: '',
                });
              }}
              className="ml-3 text-gray-500 hover:text-red-500"
            >
              ❌ Hủy
            </button>
          )}
        </div>
      </form>

      {/* Danh sách danh mục */}
      <table className="w-full border text-sm rounded shadow">
        <thead className="bg-green-100">
          <tr>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Slug</th>
            <th className="p-2 border">Danh mục cha</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id} className="hover:bg-gray-50">
              <td className="p-2 border">{cat.name}</td>
              <td className="p-2 border text-gray-500">{cat.slug}</td>
              <td className="p-2 border text-gray-600">
                {typeof cat.parent === 'object' && cat.parent?.name ? cat.parent.name : '---'}
              </td>
             <td className="p-2 border">
                {cat.status === 'active' ? (
                  <span className="text-green-600">Đang hoạt động</span>
                ) : (
                  <span className="text-red-500">Ngừng</span>
                )}
              </td>
              <td className="p-2 border space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleEdit(cat)}
                >
                  ✏️ Sửa
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(cat._id)}
                >
                  🗑️ Xoá
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-400">
                Không có danh mục nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
