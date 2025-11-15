import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';

export default function ProductListByCategory() {
  const { slug, childSlug } = useParams();
  const currentSlug = childSlug || slug;
  const { products, categories } = useShop();
  const [allSlugs, setAllSlugs] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [sortOption, setSortOption] = useState('default');

  // Breadcrumb
  const currentCategory = categories.find((cat) => cat.slug === currentSlug);
  const parentCategory = currentCategory?.parent
    ? categories.find((cat) => cat._id === currentCategory.parent)
    : null;

  // Lấy danh mục con
  useEffect(() => {
    if (!categories.length) return;

    const parent = categories.find((cat) => cat.slug === currentSlug);
    if (!parent) return;

    const childSlugs = categories
      .filter((cat) => String(cat.parent) === String(parent._id))
      .map((cat) => cat.slug);

    setAllSlugs([currentSlug, ...childSlugs]);
  }, [categories, currentSlug]);

  // Lọc sản phẩm
  let filteredProducts = products.filter(
    (product) =>
      allSlugs.includes(product.categorySlug) && product.status === 'active'
  );

  // Sắp xếp theo giá
  if (sortOption === 'asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOption === 'desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="container mx-auto px-4 py-6 relative">
      {/* 🧭 Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4 space-x-1">
        <Link to="/" className="text-green-600 hover:underline">Trang chủ</Link>
        {parentCategory && (
          <>
            <span>{'>'}</span>
            <Link
              to={`/danh-muc/${parentCategory.slug}`}
              className="hover:underline"
            >
              {parentCategory.name}
            </Link>
          </>
        )}
        <span>{'>'}</span>
        <span className="text-gray-700">{currentCategory?.name}</span>
      </div>

      {/* Tiêu đề + Bộ lọc */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold capitalize">
          Danh mục: {currentCategory?.name || currentSlug.replace(/-/g, ' ')}
        </h1>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded px-3 py-1 text-sm text-gray-700"
        >
          <option value="default">Sắp xếp</option>
          <option value="asc">Giá: Thấp đến cao</option>
          <option value="desc">Giá: Cao đến thấp</option>
        </select>
      </div>

      {/* Danh sách sản phẩm */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">Không có sản phẩm nào trong danh mục này.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      )}

      {/* Modal Quick View */}
      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
      {/* 🌟 Sản phẩm nổi bật */}
        {products.some((p) => p.isFeatured) && (
          <>
            <h2 className="mt-8 text-lg font-semibold text-gray-800 mb-3">🌟 Sản phẩm nổi bật</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {products
                .filter((p) => p.isFeatured && p.status === 'active')
                .slice(0, 5)
                .map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
            </div>
          </>
        )}
    </div>
  );
}
