import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  'Cây Cảnh',
  'Cây Công Trình',
  'Cây Hoa',
  'Vật tư',
];

const topRated = [
  {
    id: '1',
    name: 'Cây Bàng Lá Nhỏ',
    price: 3900000,
    image: 'https://vuoncayviet.com/wp-content/uploads/2023/01/cay-bang.jpg',
  },
  {
    id: '2',
    name: 'Cây Trầu Bà Lá Xẻ',
    price: 450000,
    image: 'https://vuoncayviet.com/wp-content/uploads/2023/01/cay-trau-ba-la-xe.jpg',
  },
  {
    id: '3',
    name: 'Cây Cau Tam Giác',
    price: 180000,
    image: 'https://vuoncayviet.com/wp-content/uploads/2023/01/cay-cau-tam-giac.jpg',
  },
];

export default function Sidebar() {
  return (
    <aside className="w-full md:w-64 p-4 bg-white border rounded-xl shadow-sm space-y-6">
      {/* Danh mục sản phẩm */}
      <div>
        <h2 className="text-lg font-bold text-green-700 mb-2">Danh mục sản phẩm</h2>
        <ul className="space-y-2">
          {categories.map((cat, index) => (
            <li key={index}>
              <Link
                to={`/danh-muc/${cat.toLowerCase().replace(/\s/g, '-')}`}
                className="block text-gray-700 hover:text-green-600 transition"
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Sản phẩm đánh giá cao */}
      <div>
        <h2 className="text-lg font-bold text-red-600 mb-2">Sản phẩm đánh giá cao</h2>
        <div className="space-y-4">
          {topRated.map((item) => (
            <Link
              to={`/san-pham/${item.id}`}
              key={item.id}
              className="flex items-center gap-3"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded border"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {item.name}
                </p>
                <p className="text-sm text-red-600 font-medium">
                  {item.price.toLocaleString()}đ
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
