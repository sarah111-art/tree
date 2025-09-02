import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { useNavigate } from 'react-router-dom';
import { PageLoading } from '../../components/Loading';

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    salePrice: '',
    quantity: '',
    category: '',
    status: 'active',
    isFeatured: false,
    image: '',
    images: [], // [{ url, alt }]
    tags: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${backendUrl}/api/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error("Không thể load danh mục:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${backendUrl}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setForm({ ...form, image: res.data.url });
    } catch (err) {
      console.error("Lỗi upload ảnh:", err);
      alert("❌ Lỗi upload ảnh");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chuyển tags và keywords thành mảng
    const tags = form.tags ? form.tags.split(',').map(t => t.trim()) : [];
    const metaKeywords = form.metaKeywords ? form.metaKeywords.split(',').map(k => k.trim()) : [];

    const payload = {
      ...form,
      price: parseFloat(form.price),
      salePrice: parseFloat(form.salePrice || 0),
      quantity: parseInt(form.quantity),
      tags,
      metaKeywords,
      images: form.image ? [{ url: form.image, alt: form.name }] : []
    };

    if (!payload.name || !payload.price || !payload.quantity || !payload.category || !payload.description) {
      return alert("⚠️ Vui lòng nhập đủ tên, giá, số lượng, mô tả, danh mục.");
    }

    try {
      await axios.post(`${backendUrl}/api/products`, payload);
      alert("✅ Thêm sản phẩm thành công!");
      navigate('/admin/products');
    } catch (err) {
      console.error("❌ Lỗi khi thêm sản phẩm:", err.response?.data || err);
      alert("❌ Lỗi khi thêm sản phẩm!");
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">➕ Thêm Sản phẩm mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Tên sản phẩm" required className="w-full border px-3 py-2" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả đầy đủ" className="w-full border px-3 py-2" />
        <input name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Mô tả ngắn" className="w-full border px-3 py-2" />

        <div className="grid grid-cols-2 gap-4">
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Giá" className="w-full border px-3 py-2" />
          <input name="salePrice" type="number" value={form.salePrice} onChange={handleChange} placeholder="Giá khuyến mãi" className="w-full border px-3 py-2" />
        </div>

        <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="Số lượng kho" className="w-full border px-3 py-2" />

        <div>
          <label className="block font-semibold">Ảnh đại diện</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" />
          {form.image && <img src={form.image} alt="Preview" className="mt-2 w-32 h-32 object-cover border rounded" />}
        </div>

        <select name="category" value={form.category} onChange={handleChange} className="w-full border px-3 py-2">
          <option value="">-- Chọn danh mục --</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (phân cách dấu ,)" className="w-full border px-3 py-2" />

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

        {/* SEO Fields */}
        <input name="metaTitle" value={form.metaTitle} onChange={handleChange} placeholder="Meta Title (SEO)" className="w-full border px-3 py-2" />
        <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} placeholder="Meta Description (SEO)" className="w-full border px-3 py-2" />
        <input name="metaKeywords" value={form.metaKeywords} onChange={handleChange} placeholder="Meta Keywords (phân cách bằng dấu ,)" className="w-full border px-3 py-2" />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
