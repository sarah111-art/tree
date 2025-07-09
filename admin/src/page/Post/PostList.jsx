import React, { useEffect, useState } from 'react';
import api from '../api';
import { backendUrl } from '../../App';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    title: '',
    image: '',
    category: '',
    content: '',
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });

  const fetchPosts = async () => {
    const res = await axios.get(`${backendUrl}/api/posts`);
    setPosts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${backendUrl}/api/categories`);
    setCategories(res.data);
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);
const handleUpload = async () => {
  const formData = new FormData();
  formData.append('image', file); // ← PHẢI là 'image'

  try {
    const res = await axios.post(`${backendUrl}/api/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.url;
  } catch (err) {
    console.error('❌ Upload ảnh lỗi:', err?.response?.data || err.message);
    alert('❌ Upload ảnh lỗi: ' + JSON.stringify(err?.response?.data || err.message));
    throw err;
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = form.image;

    if (file) {
      try {
        imageUrl = await handleUpload();
      } catch (err) {
        alert('❌ Lỗi upload ảnh');
        return;
      }
    }

    const payload = { ...form, image: imageUrl };

    try {
      if (editingId) {
        await axios.put(`${backendUrl}/api/posts/${editingId}`, payload);
        alert('✅ Cập nhật bài viết thành công');
      } else {
        await axios.post(`${backendUrl}/api/posts`, payload);
        alert('✅ Thêm bài viết thành công');
      }
      resetForm();
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi lưu bài viết');
    }
  };

  const handleEdit = (post) => {
    setForm({
      title: post.title,
      image: post.image || '',
      category: post.category || '',
      content: post.content || '',
      status: post.status || 'draft',
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      metaKeywords: post.metaKeywords?.join(', ') || '',
    });
    setEditingId(post._id);
  };

  const resetForm = () => {
    setForm({
      title: '',
      image: '',
      category: '',
      content: '',
      status: 'draft',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    });
    setFile(null);
    setEditingId(null);
  };

  const deletePost = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá bài viết này?')) {
      await axios.delete(`${backendUrl}/api/posts/${id}`);
      fetchPosts();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">📝 Quản lý bài viết</h2>

      {/* Form thêm/sửa bài viết */}
      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
        <input
          className="border p-2 w-full"
          placeholder="Tiêu đề bài viết"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <select
          className="border p-2 w-full"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">-- Chọn chuyên mục --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        {form.image && (
          <img src={form.image} alt="preview" className="w-40 h-28 object-cover border mt-2" />
        )}

        <ReactQuill
          value={form.content}
          onChange={(val) => setForm({ ...form, content: val })}
          placeholder="Nội dung bài viết"
        />
        <select
          className="border p-2 w-full"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="draft">Nháp</option>
          <option value="published">Công khai</option>
        </select>
        <input
          className="border p-2 w-full"
          placeholder="Meta Title"
          value={form.metaTitle}
          onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Meta Keywords (cách nhau bằng ,)"
          value={form.metaKeywords}
          onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Meta Description"
          value={form.metaDescription}
          onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? '💾 Cập nhật' : '➕ Thêm mới'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* Danh sách bài viết */}
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded shadow bg-white">
            <div className="flex gap-4">
              {post.image && (
                <img src={post.image} alt="thumb" className="w-28 h-20 object-cover rounded border" />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <div className="text-sm text-gray-500">
                  Ngày đăng: {dayjs(post.createdAt).format('DD/MM/YYYY')}
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Trạng thái: {post.status}
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-4">
              <button
                onClick={() => handleEdit(post)}
                className="text-blue-600 hover:underline text-sm"
              >
                ✏️ Sửa
              </button>
              <button
                onClick={() => deletePost(post._id)}
                className="text-red-600 hover:underline text-sm"
              >
                🗑 Xoá
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
