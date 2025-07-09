import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    salePrice: '',
    stock: '',
    image: '',
    images: [],
    category: '',
    status: 'active',
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, productRes] = await Promise.all([
          axios.get(`${backendUrl}/api/categories`),
          axios.get(`${backendUrl}/api/products/${id}`)
        ]);

        setCategories(catRes.data);

        setForm({
          ...productRes.data,
          stock: productRes.data.quantity || '',
          metaKeywords: productRes.data.metaKeywords?.join(', ') || '',
          images: productRes.data.images || [],
        });
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        alert("❌ Không thể tải thông tin sản phẩm!");
      }
    };

    fetchData();
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${backendUrl}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, image: res.data.url }));
    } catch (err) {
      console.error("❌ Lỗi upload ảnh:", err);
      alert("❌ Lỗi upload ảnh!");
    }
  };
const handleAddSubImages = async (e) => {
  const files = Array.from(e.target.files);
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const res = await axios.post(`${backendUrl}/api/upload/multiple`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Chỉ thêm ảnh đã upload thành công (có url)
    const newImages = res.data.map(img => ({
      url: img.url,
      alt: img.alt || form.name || 'Ảnh phụ'
    }));

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  } catch (err) {
    console.error('❌ Upload ảnh phụ thất bại:', err.response?.data || err.message);
    alert('❌ Upload ảnh phụ thất bại:\n' + JSON.stringify(err.response?.data || err.message));
  }
};



  const handleRemoveSubImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...form,
      quantity: form.stock,
      metaKeywords: form.metaKeywords.split(',').map(k => k.trim()),
      images: form.images.map(img => ({
        url: img.url,
        alt: img.alt || form.name
      }))
    };

    try {
      await axios.put(`${backendUrl}/api/products/${id}`, updatedData);
      alert("✅ Cập nhật sản phẩm thành công!");
      navigate('/admin/products');
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật sản phẩm:", err);
      alert("❌ Lỗi khi cập nhật sản phẩm!");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">✏️ Sửa sản phẩm</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Tên sản phẩm" required className="w-full border px-3 py-2" />

        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả chi tiết" className="w-full border px-3 py-2" />

        <textarea name="shortDescription" value={form.shortDescription || ''} onChange={handleChange} placeholder="Mô tả ngắn (max 160 ký tự)" maxLength={160} className="w-full border px-3 py-2" />

        <div className="grid grid-cols-2 gap-4">
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Giá gốc" className="w-full border px-3 py-2" />
          <input name="salePrice" type="number" value={form.salePrice || ''} onChange={handleChange} placeholder="Giá khuyến mãi" className="w-full border px-3 py-2" />
        </div>

        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Số lượng kho" className="w-full border px-3 py-2" />

        {/* Ảnh đại diện */}
        <div>
          <label className="block font-semibold">Ảnh đại diện</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" />
          {form.image && (
            <img src={form.image} alt="Ảnh sản phẩm" className="mt-2 w-32 h-32 object-cover border rounded" />
          )}
        </div>

        {/* Ảnh phụ */}
        <div>
          <label className="block font-semibold">Ảnh phụ</label>
          <input type="file" accept="image/*" multiple onChange={handleAddSubImages} className="mt-1" />
          <div className="flex flex-wrap gap-2 mt-2">
            {form.images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24">
                <img src={img.url} alt={img.alt || 'Ảnh phụ'} className="w-full h-full object-cover border rounded" />
                <button
                  type="button"
                  onClick={() => handleRemoveSubImage(idx)}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danh mục */}
        <select name="category" value={form.category} onChange={handleChange} className="w-full border px-3 py-2">
          <option value="">-- Chọn danh mục --</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        {/* Trạng thái + nổi bật */}
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
            Nổi bật
          </label>
          <select name="status" value={form.status} onChange={handleChange} className="border px-2 py-1">
            <option value="active">Hiển thị</option>
            <option value="inactive">Ẩn</option>
          </select>
        </div>

        {/* SEO */}
        <input name="metaTitle" value={form.metaTitle || ''} onChange={handleChange} placeholder="Meta Title (SEO)" className="w-full border px-3 py-2" />
        <textarea name="metaDescription" value={form.metaDescription || ''} onChange={handleChange} placeholder="Meta Description (SEO)" className="w-full border px-3 py-2" />
        <input name="metaKeywords" value={form.metaKeywords || ''} onChange={handleChange} placeholder="Meta Keywords (cách nhau bằng dấu ,)" className="w-full border px-3 py-2" />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default EditProduct;