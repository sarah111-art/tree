import React from 'react';
import { useWishlist, useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useShop();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        💚 Danh sách yêu thích ({wishlist.length} sản phẩm)
      </h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-600">Bạn chưa thêm sản phẩm nào vào yêu thích.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div key={product._id || product.id} className="border p-4 rounded-xl shadow bg-white hover:shadow-md transition">
             <LazyLoadImage
  src={
    product.image ||
    (product.images && product.images.length > 0 && product.images[0].url) ||
    '/placeholder.jpg' // ảnh mặc định
  }
  alt={product.name || 'Ảnh sản phẩm'}
  effect="blur"
  className="h-48 w-full object-cover rounded mb-3"
/>

              <h3 className="font-semibold text-lg text-gray-800 truncate">{product.name}</h3>
              <p className="text-green-600 font-bold mt-1">{product.price.toLocaleString()} đ</p>

              <div className="mt-4 flex justify-between items-center text-sm">
                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center gap-1 text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                >
                  <ShoppingCart size={16} /> Mua ngay
                </button>

                <button
                  onClick={() => removeFromWishlist(product._id || product.id)}
                  className="flex items-center gap-1 text-red-500 hover:underline"
                >
                  <Trash2 size={16} /> Xoá
                </button>
              </div>

              <Link
                to={`/san-pham/${product._id || product.id}`}
                className="block mt-2 text-blue-600 hover:underline text-sm text-center"
              >
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
