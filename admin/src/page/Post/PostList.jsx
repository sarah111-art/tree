import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';
import { PageLoading } from '../../components/Loading';
import { toast } from 'react-toastify';
import { X, ArrowUp, ArrowDown, Upload } from 'lucide-react';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadingImages, setUploadingImages] = useState([false, false, false]);

  const [form, setForm] = useState({
    title: '',
    image: '',
    images: ['', '', ''],
    category: '',
    content: '',
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const res = await axios.get(`${backendUrl}/api/posts`);
    setPosts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${backendUrl}/api/categories`);
    setCategories(res.data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchPosts(), fetchCategories()]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
const handleUpload = async (fileToUpload) => {
  if (!fileToUpload) return null;
  
  const formData = new FormData();
  formData.append('image', fileToUpload);

  try {
    const res = await axios.post(`${backendUrl}/api/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.url;
  } catch (err) {
    console.error('❌ Upload ảnh lỗi:', err?.response?.data || err.message);
    toast.error('Lỗi upload ảnh');
    throw err;
  }
};

const handleImageUpload = async (index, file) => {
  if (!file) return;
  
  setUploadingImages(prev => {
    const newState = [...prev];
    newState[index] = true;
    return newState;
  });

  try {
    const imageUrl = await handleUpload(file);
    const newImages = [...form.images];
    newImages[index] = imageUrl;
    setForm({ ...form, images: newImages });
    toast.success(`Upload ảnh ${index + 1} thành công!`);
  } catch (err) {
    toast.error(`Lỗi upload ảnh ${index + 1}`);
  } finally {
    setUploadingImages(prev => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  }
};

const handleRemoveImage = (index) => {
  const newImages = [...form.images];
  newImages[index] = '';
  // Đảm bảo luôn có 3 vị trí
  while (newImages.length < 3) {
    newImages.push('');
  }
  setForm({ ...form, images: newImages });
};

const handleMoveImage = (index, direction) => {
  const newImages = [...form.images];
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  
  if (targetIndex >= 0 && targetIndex < newImages.length) {
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setForm({ ...form, images: newImages });
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = form.image;

    if (file) {
      try {
        imageUrl = await handleUpload(file);
      } catch (err) {
        toast.error('Lỗi upload ảnh đại diện');
        return;
      }
    }

    const payload = {
      ...form,
      image: imageUrl,
      images: form.images.filter(img => img && img.trim() !== ''), // Loại bỏ ảnh rỗng
      metaKeywords: form.metaKeywords ? form.metaKeywords.split(',').map(k => k.trim()) : []
    };

    try {
      if (editingId) {
        await axios.put(`${backendUrl}/api/posts/${editingId}`, payload);
        toast.success('Cập nhật bài viết thành công!');
      } else {
        await axios.post(`${backendUrl}/api/posts`, payload);
        toast.success('Thêm bài viết thành công!');
      }
      resetForm();
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Lỗi khi lưu bài viết');
    }
  };

  const handleEdit = (post) => {
    const images = Array.isArray(post.images) && post.images.length > 0 
      ? [...post.images] 
      : ['', '', ''];
    
    // Đảm bảo luôn có 3 vị trí
    while (images.length < 3) {
      images.push('');
    }
    
    setForm({
      title: post.title,
      image: post.image || '',
      images: images.slice(0, 3),
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
      images: ['', '', ''],
      category: '',
      content: '',
      status: 'draft',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    });
    setFile(null);
    setEditingId(null);
    setUploadingImages([false, false, false]);
  };

  if (loading) {
    return <PageLoading />;
  }

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

        {/* 3 Ảnh bài viết */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            3 Ảnh bài viết (sắp xếp vị trí)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
                <div className="text-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Ảnh {index + 1}</span>
                </div>
                
                {form.images[index] ? (
                  <div className="relative group">
                    <img 
                      src={form.images[index]} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                        title="Xóa ảnh"
                      >
                        <X size={16} />
                      </button>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, 'up')}
                          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          title="Di chuyển lên"
                        >
                          <ArrowUp size={16} />
                        </button>
                      )}
                      {index < 2 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, 'down')}
                          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          title="Di chuyển xuống"
                        >
                          <ArrowDown size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg bg-green-100">
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-sm text-gray-600 hover:text-green-600">Chọn ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleImageUpload(index, file);
                          }
                        }}
                        className="hidden"
                        disabled={uploadingImages[index]}
                      />
                    </label>
                    {uploadingImages[index] && (
                      <span className="text-xs text-gray-500 mt-2">Đang upload...</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Bạn có thể upload 3 ảnh và sắp xếp lại thứ tự bằng các nút mũi tên
          </p>
        </div>

        {/* Ảnh đại diện */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ảnh đại diện (tùy chọn)
          </label>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
            className="w-full px-3 py-2 border rounded"
          />
          {form.image && !file && (
            <img src={form.image} alt="preview" className="w-40 h-28 object-cover border mt-2 rounded" />
          )}
        </div>

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
              <div className="flex gap-2">
                {post.images && post.images.length > 0 ? (
                  post.images.slice(0, 3).map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt={`${post.title} ${idx + 1}`} 
                      className="w-28 h-20 object-cover rounded border"
                    />
                  ))
                ) : post.image ? (
                  <img src={post.image} alt="thumb" className="w-28 h-20 object-cover rounded border" />
                ) : (
                  <div className="w-28 h-20 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">
                    Không có ảnh
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <div className="text-sm text-gray-500">
                  Ngày đăng: {dayjs(post.createdAt).format('DD/MM/YYYY')}
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Trạng thái: {post.status === 'published' ? '✅ Đã xuất bản' : '📝 Nháp'}
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
