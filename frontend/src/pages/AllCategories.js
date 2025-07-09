import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../context/ShopContext';
import { Link } from 'react-router-dom';

export default function AllCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${backendUrl}/api/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error('❌ Lỗi khi tải danh mục:', err.message));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">📂 Tất cả danh mục</h1>
      {categories.length === 0 ? (
        <p className="text-gray-500">Không có danh mục nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <Link
              to={`/danh-muc/${cat.slug}`}
              key={cat._id}
              className="border rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={cat.image || '/placeholder.jpg'}
                alt={cat.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-3 text-center">
                <h3 className="text-lg font-semibold">{cat.name}</h3>
                <p className="text-gray-500 text-sm">{cat.count} sản phẩm</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
