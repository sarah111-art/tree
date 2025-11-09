import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../context/ShopContext'; // Import backend URL from context
export default function CategorySlider() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
      const res = await axios.get(`${backendUrl}/api/categories`);   
       // Chỉ lấy các danh mục có parent (danh mục cha)
       const categoriesWithParent = res.data.filter(cat => cat.parent);
       setCategories(categoriesWithParent);
      } catch (err) {
        console.error('❌ Lỗi khi tải danh mục:', err.message);
      }
    };

    fetchCategories();
  }, []);
  return (
    <section className="my-10">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-2xl font-semibold">Danh mục sản phẩm</h2>
        <Link
          to="/danh-muc"
          className="text-green-600 hover:underline text-sm"
        >
          Xem tất cả
        </Link>
      </div>
      {/* Lưới đồng đều thay vì scroll ngang */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/danh-muc/${cat.slug}`}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full aspect-square object-cover"
            />
            <div className="p-4 text-center flex flex-col flex-1">
              <h3 className="text-base font-semibold text-gray-800 line-clamp-2 min-h-[44px]">
                {cat.name}
              </h3>
              <div className="mt-auto" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
