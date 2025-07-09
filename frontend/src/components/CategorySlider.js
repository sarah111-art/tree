import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function CategorySlider() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/categories'); // URL backend của bạn
        setCategories(res.data); // Giả sử API trả về mảng [{ name, slug, image, count }]
      } catch (err) {
        console.error('❌ Lỗi khi tải danh mục:', err.message);
      }
    };

    fetchCategories();
  }, []);
  return (
    <section className="my-10">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-2xl font-semibold">🌿 Danh mục sản phẩm</h2>
        <Link
          to="/danh-muc"
          className="text-green-600 hover:underline text-sm"
        >
          Xem tất cả
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/danh-muc/${cat.slug}`}
            className="min-w-[180px] bg-white shadow rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="p-2 text-center">
              <h3 className="text-md font-semibold">{cat.name}</h3>
              <p className="text-gray-500 text-sm">{cat.count} sản phẩm</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
