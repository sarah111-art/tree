import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import ProductCard from './ProductCard';

export default function SidebarFilter({ categories, onPriceFilter, onCategoryFilter, discountProducts }) {
  const [selectedPrice, setSelectedPrice] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const priceRanges = [
    { label: 'Dưới 500.000₫', value: '0-500000' },
    { label: '500.000₫ - 2.000.000₫', value: '500000-2000000' },
    { label: '2.000.000₫ - 5.000.000₫', value: '2000000-5000000' },
    { label: '5.000.000₫ - 10.000.000₫', value: '5000000-10000000' },
    { label: '10.000.000₫ - 30.000.000₫', value: '10000000-30000000' },
  ];

  const handlePriceChange = (value) => {
    setSelectedPrice(value);
    onPriceFilter && onPriceFilter(value);
  };

  const handleCategoryChange = (categoryId) => {
    onCategoryFilter && onCategoryFilter(categoryId);
  };

  const FilterContent = () => (
    <>
      {/* Danh mục */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Danh mục</h3>
        <ul className="space-y-2">
          {categories
            .filter(cat => cat.parent)
            .slice(0, 5)
            .map((cat) => (
              <li key={cat._id}>
                <Link 
                  to={`/danh-muc/${cat.slug}`}
                  className="text-gray-600 hover:text-green-600 text-sm"
                  onClick={() => {
                    handleCategoryChange(cat._id);
                    setIsMobileFilterOpen(false);
                  }}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>

      {/* Lọc giá */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Lọc giá</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                value={range.value}
                checked={selectedPrice === range.value}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <span className="text-sm text-gray-600">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Thương hiệu */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Thương hiệu</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
            Còi Garden
          </span>
        </div>
      </div>

      {/* Loại */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Loại</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
            Terrarium
          </span>
        </div>
      </div>

      {/* Giảm giá */}
      {discountProducts && discountProducts.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Giảm giá</h3>
          <div className="space-y-3">
            {discountProducts.slice(0, 1).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsMobileFilterOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
      >
        <Filter size={20} />
        <span className="font-medium">Lọc</span>
      </button>

      {/* Mobile Filter Overlay */}
      {isMobileFilterOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-[9999]"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div 
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto pt-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800">Bộ lọc</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 pr-6">
        <FilterContent />
      </aside>
    </>
  );
}



