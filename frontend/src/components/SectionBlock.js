// src/components/SectionBlock.jsx
import React from 'react';
import ProductCard from './ProductCard';

export default function SectionBlock({ title, products, onQuickView = () => {} }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="my-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 relative">
            <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              {title}
            </span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
          </h2>
          <p className="text-gray-600 text-lg">Khám phá bộ sưu tập {title.toLowerCase()} chất lượng cao</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
