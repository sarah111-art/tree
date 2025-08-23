import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { backendUrl, useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [star, setStar] = useState('');
  const [comment, setComment] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const { products, token, user } = useShop();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Load sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/products/${id}`);
        const data = res.data;
        setProduct(data);
        setSelectedImage(data.image || data.images?.[0]?.url || '');
      } catch (err) {
        console.error('❌ Lỗi khi tải sản phẩm:', err.message);
      }
    };
    fetchProduct();
  }, [id]);

  // Load category name theo _id
useEffect(() => {
  if (product?.category) {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/categories/${product.category}`);
        setCategoryName(res.data.name);
        // ✅ Thêm dòng này để cập nhật product.categorySlug
        setProduct(prev => ({
          ...prev,
          categorySlug: res.data.slug, // gắn thêm slug vào product
        }));
      } catch (err) {
        console.error('❌ Lỗi lấy category:', err.message);
      }
    };
    fetchCategory();
  }
}, [product?.category]);


  // Lọc sản phẩm liên quan
const filteredProducts = useMemo(() => {
  if (!product?.categorySlug) return [];
  return products.filter(
    (p) =>
      p._id !== product._id &&
      p.categorySlug?.trim().toLowerCase() === product.categorySlug.trim().toLowerCase() &&
      p.status === 'active'
  );
}, [products, product]);

  // Gửi đánh giá
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra đăng nhập
    if (!token || !user) {
      alert('🔐 Vui lòng đăng nhập để đánh giá sản phẩm!');
      return;
    }
    
    try {
      const reviewData = {
        star,
        comment,
        postedBy: user._id // Sử dụng user ID thực từ context
      };
      const res = await axios.post(`${backendUrl}/api/products/${id}/review`, reviewData);
      alert('🎉 Gửi đánh giá thành công!');
      setStar('');
      setComment('');
      setProduct(res.data); // Cập nhật lại sản phẩm
    } catch (err) {
      alert('❌ Lỗi gửi đánh giá: ' + err.message);
    }
  };

  if (!product) {
    return <p className="text-center mt-10 text-gray-500">⏳ Đang tải sản phẩm...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
<nav className="text-sm mb-4 text-gray-600">
  <Link to="/" className="hover:underline text-green-600">Home</Link> {' > '}
  {categoryName && product.categorySlug && (
    <>
      <Link to={`/danh-muc/${product.categorySlug}`} className="hover:underline text-green-600">
        {categoryName}
      </Link>{' > '}
    </>
  )}
  <span className="font-medium">{product.name}</span>
</nav>


      <div className="grid md:grid-cols-2 gap-8">
        {/* Hình ảnh */}
        <div>
          <img
            src={selectedImage || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-lg shadow"
          />

          {/* Ảnh phụ */}
          {product.images?.length > 0 && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {[product.image, ...product.images.map(i => i.url)].filter(Boolean).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border ${selectedImage === img ? 'ring-2 ring-green-600' : ''}`}
                  alt={`ảnh phụ ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thông tin */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            {product.salePrice > 0 && (
              <p className="text-gray-400 line-through text-lg">
                {product.price.toLocaleString()}đ
              </p>
            )}
            <p className="text-red-600 text-2xl font-bold">
              {(product.salePrice > 0 ? product.salePrice : product.price).toLocaleString()}đ
            </p>
          </div>

          <p className="mt-4 text-gray-700 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          <ul className="list-disc list-inside text-green-700 mt-4 space-y-1">
            <li>Đất sạch, an toàn, giàu dinh dưỡng tự nhiên</li>
            <li>Phù hợp nhiều loại cây bonsai, kiểng và rau</li>
            <li>Giao nhanh trong ngày tại TP.HCM</li>
            <li>Tư vấn tận tâm, hỗ trợ 24/7</li>
          </ul>

          <div className="mt-6">
            <label className="block font-semibold mb-1 text-gray-700">
              SỐ LƯỢNG:
            </label>
            <input
              type="number"
              min="1"
              defaultValue={1}
              className="w-20 border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <button className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition">
              THÊM VÀO GIỎ
            </button>
            <a
              href="tel:0123456789"
              className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition"
            >
              📞 GỌI MUA HÀNG
            </a>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Mã sản phẩm: <span className="font-mono">SP-{product._id.slice(0, 6).toUpperCase()}</span>
          </p>
        </div>
      </div>

      {/* Đánh giá */}
      <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-2">📝 Viết đánh giá của bạn</h3>
      
      {!token ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <div className="flex items-center gap-3">
            <span className="text-yellow-600 text-xl">🔐</span>
            <div>
              <p className="text-yellow-800 font-medium">Vui lòng đăng nhập để đánh giá sản phẩm</p>
              <p className="text-yellow-700 text-sm mt-1">Đăng nhập để chia sẻ cảm nhận của bạn về sản phẩm này</p>
            </div>
          </div>
          <div className="mt-3">
            <Link 
              to="/dang-nhap" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleReviewSubmit} className="bg-gray-50 border p-4 rounded-md space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-600">✅</span>
            <span className="text-green-700 font-medium">Xin chào, {user.name || user.phone}!</span>
          </div>
          
          <label className="block font-medium text-gray-700">🌟 Đánh giá sao:</label>
          <select
            value={star}
            onChange={(e) => setStar(Number(e.target.value))}
            className="border px-2 py-1 rounded w-full"
            required
          >
            <option value="">Chọn số sao</option>
            {[5, 4, 3, 2, 1].map(s => (
              <option key={s} value={s}>{s} sao</option>
            ))}
          </select>

          <label className="block font-medium text-gray-700">💬 Nhận xét:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border px-2 py-2 rounded w-full"
            placeholder="Hãy chia sẻ cảm nhận của bạn..."
            rows={3}
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Gửi đánh giá
          </button>
        </form>
      )}

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">🗣️ Các đánh giá</h3>
        {product.ratings.length === 0 ? (
          <p className="text-gray-500">Chưa có đánh giá nào.</p>
        ) : (
          product.ratings.map((r, i) => (
            <div key={i} className="border rounded p-3 bg-white">
              <p className="text-yellow-500">⭐ {r.star} sao</p>
              <p className="text-gray-700">{r.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Sản phẩm liên quan */}
      {filteredProducts.length > 0 && (
        <>
          <h2 className="mt-12 text-xl font-bold text-gray-800">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {filteredProducts.slice(0, 3).map((p) => (
              <ProductCard key={p._id} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
