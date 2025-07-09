import React, { useEffect, useState } from 'react';
import axios from '../api';
import { Link } from 'react-router-dom';
import { backendUrl } from '../../App';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/products`);
      setProducts(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi load sản phẩm:", err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) {
      try {
        await axios.delete(`${backendUrl}/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("❌ Xoá thất bại:", err.message);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">🛒 Danh sách sản phẩm</h2>
        <Link to="/admin/products/add" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          ➕ Thêm sản phẩm
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow rounded">
          <thead className="bg-green-100 text-left">
            <tr>
              <th className="p-2 border">Ảnh</th>
              <th className="p-2 border">Tên</th>
              <th className="p-2 border">Danh mục</th>
              <th className="p-2 border">Giá</th>
              <th className="p-2 border">SEO</th>
              <th className="p-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <span className="text-gray-400">Chưa có ảnh</span>
                  )}
                </td>
                <td className="p-2 border font-semibold">{product.name}</td>
                <td className="p-2 border">{product.category?.name || "N/A"}</td>
                <td className="p-2 border text-green-600">{product.price?.toLocaleString()}₫</td>
                <td className="p-2 border text-xs">
                  <div><strong>Meta:</strong> {product.metaTitle || '---'}</div>
                  <div><strong>Từ khoá:</strong> {product.metaKeywords?.join(', ') || '---'}</div>
                </td>
                <td className="p-2 border space-x-2">
                  <Link to={`/admin/products/edit/${product._id}`} className="text-blue-600 hover:underline">
                    ✏️ Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑️ Xoá
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  Không có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
