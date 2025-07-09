// src/components/SectionBlock.jsx
import React from 'react';
import ProductCard from './ProductCard';

export default function SectionBlock({ title, products, onQuickView = () => {} }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="my-10">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  );
}
