import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard'; 
import { backendUrl } from '../context/ShopContext';

export default function ProductList({ onQuickView = () => {} }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {     
        const res = await axios.get(`${backendUrl}/api/products`); 
        setProducts(res.data);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  );
}
