import React from 'react';
import { Link } from 'react-router-dom';

export default function RelatedProducts({ currentProductId, products, categoryId }) {
  const related = products
    .filter(p => p._id !== currentProductId && String(p.category) === String(categoryId))
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">🛍️ Sản phẩm liên quan</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((item) => (
          <Link key={item._id} to={`/san-pham/${item._id}`}>
            <div className="border p-3 rounded hover:shadow transition bg-white">
              <img
                src={item.image || item.images?.[0]?.url || '/placeholder.jpg'}
                alt={item.name}
                className="w-full h-40 object-cover rounded"
              />
              <h4 className="font-semibold mt-2 truncate">{item.name}</h4>
              <p className="text-red-500 font-bold">{item.price.toLocaleString()}đ</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
