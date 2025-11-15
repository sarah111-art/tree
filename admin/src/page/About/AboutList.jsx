import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { PageLoading } from '../../components/Loading';
import PageWrapper from '../../components/PageWrapper';
import { Trash2, Edit, Plus, Eye, EyeOff, X, ArrowUp, ArrowDown, Upload } from 'lucide-react';

export default function AboutList() {
  const [abouts, setAbouts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImages, setUploadingImages] = useState([false, false, false]);

  const [form, setForm] = useState({
    title: '',
    content: '',
    image: '',
    images: [],
    status: 'active',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    mission: '',
    vision: '',
    values: []
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAbouts();
  }, []);

  const fetchAbouts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/about`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAbouts(res.data);
    } catch (err) {
      toast.error('Không thể tải danh sách giới thiệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      console.error('❌ Upload ảnh lỗi:', err);
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

  const resetForm = () => {
    setForm({
      title: '',
      content: '',
      image: '',
      images: ['', '', ''],
      status: 'active',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      mission: '',
      vision: '',
      values: []
    });
    setFile(null);
    setEditingId(null);
    setShowForm(false);
    setUploadingImages([false, false, false]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Vui lòng điền đầy đủ tiêu đề và nội dung');
      return;
    }

    setSubmitting(true);
    let imageUrl = form.image;

    try {
      if (file) {
        imageUrl = await handleUpload();
      }

      const payload = {
        ...form,
        image: imageUrl,
        images: form.images.filter(img => img && img.trim() !== ''), // Loại bỏ ảnh rỗng
        metaKeywords: form.metaKeywords ? form.metaKeywords.split(',').map(k => k.trim()) : [],
        values: form.values.length > 0 && typeof form.values[0] === 'string' 
          ? form.values[0].split(',').map(v => v.trim()) 
          : form.values
      };

      if (editingId) {
        await axios.put(`${backendUrl}/api/about/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Cập nhật phần giới thiệu thành công!');
      } else {
        await axios.post(`${backendUrl}/api/about`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Thêm phần giới thiệu thành công!');
      }
      
      resetForm();
      fetchAbouts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Lỗi khi lưu phần giới thiệu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (about) => {
    const images = Array.isArray(about.images) && about.images.length > 0 
      ? [...about.images] 
      : ['', '', ''];
    
    // Đảm bảo luôn có 3 vị trí
    while (images.length < 3) {
      images.push('');
    }
    
    setForm({
      title: about.title || '',
      content: about.content || '',
      image: about.image || '',
      images: images.slice(0, 3),
      status: about.status || 'active',
      metaTitle: about.metaTitle || '',
      metaDescription: about.metaDescription || '',
      metaKeywords: Array.isArray(about.metaKeywords) ? about.metaKeywords.join(', ') : '',
      mission: about.mission || '',
      vision: about.vision || '',
      values: Array.isArray(about.values) ? about.values : []
    });
    setEditingId(about._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phần giới thiệu này?')) {
      return;
    }

    try {
      await axios.delete(`${backendUrl}/api/about/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Xóa phần giới thiệu thành công!');
      fetchAbouts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi xóa phần giới thiệu');
    }
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <PageWrapper>
        <PageLoading />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Giới thiệu</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Plus size={20} />
          Thêm mới
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Chỉnh sửa' : 'Thêm mới'} phần giới thiệu
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung *
              </label>
              <ReactQuill
                value={form.content}
                onChange={(value) => setForm({ ...form, content: value })}
                theme="snow"
                className="bg-white"
              />
            </div>

            {/* 3 Ảnh giới thiệu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                3 Ảnh giới thiệu (sắp xếp vị trí)
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ảnh đại diện (tùy chọn)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full px-3 py-2 border rounded"
                />
                {form.image && !file && (
                  <img src={form.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sứ mệnh
              </label>
              <textarea
                value={form.mission}
                onChange={(e) => setForm({ ...form, mission: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tầm nhìn
              </label>
              <textarea
                value={form.vision}
                onChange={(e) => setForm({ ...form, vision: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá trị cốt lõi (phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={Array.isArray(form.values) ? form.values.join(', ') : form.values}
                onChange={(e) => setForm({ ...form, values: e.target.value })}
                placeholder="Ví dụ: Chất lượng, Uy tín, Tận tâm"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title (SEO)
                </label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Keywords (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={form.metaKeywords}
                  onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description (SEO)
              </label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Thêm mới'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Danh sách */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tiêu đề</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ảnh</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ngày tạo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {abouts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    Chưa có phần giới thiệu nào
                  </td>
                </tr>
              ) : (
                abouts.map((about) => (
                  <tr key={about._id} className="hover:bg-green-500">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{about.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: about.content?.substring(0, 100) }} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {about.images && about.images.length > 0 ? (
                          about.images.slice(0, 3).map((img, idx) => (
                            <img 
                              key={idx} 
                              src={img} 
                              alt={`${about.title} ${idx + 1}`} 
                              className="w-16 h-16 object-cover rounded border"
                            />
                          ))
                        ) : about.image ? (
                          <img src={about.image} alt={about.title} className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <span className="text-gray-400 text-sm">Không có ảnh</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        about.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {about.status === 'active' ? (
                          <span className="flex items-center gap-1">
                            <Eye size={14} /> Hoạt động
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <EyeOff size={14} /> Không hoạt động
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(about.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(about)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(about._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}

