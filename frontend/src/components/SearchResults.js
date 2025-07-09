import React from 'react';
import { useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery();
  const searchTerm = query.get('q')?.toLowerCase() || '';
  const { products } = useShop();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">
        Kết quả tìm kiếm cho: "{searchTerm}"
      </h1>

      {filtered.length === 0 ? (
        <p className="text-gray-600">Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
