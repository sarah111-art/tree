import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useShop, useWishlist } from '../context/ShopContext';

const ProductCard = React.memo(({ product, onQuickView }) => {
const { addToCart } = useShop();
const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
//add to cart
  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  // Thêm vào yêu thích
const isLiked = wishlist.some((item) => item._id === product._id);  
const toggleWishlist = () => {
    isLiked ? removeFromWishlist(product._id) : addToWishlist(product);
  };
  // ...existing code...
  return (
    <div className="flex flex-col border rounded-2xl p-4 shadow-md hover:shadow-xl transition duration-300 bg-white relative group h-full">
      {/* Ảnh sản phẩm */}
      <div className="overflow-hidden rounded-lg mb-3">
        <Link to={`/san-pham/${product._id}`}>
      <LazyLoadImage
  src={product.image || product.images?.[0]?.url}
  alt={product.name}
  effect="blur"
  className="w-full aspect-square object-cover transform group-hover:scale-105 transition duration-300 rounded-lg"
/>

        </Link>
      </div>

      {/* Nội dung - thêm flex-1 để đẩy nút xuống đáy */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <Link to={`/san-pham/${product._id}`}>
            <h2 className="text-lg font-bold text-gray-800 truncate">{product.name}</h2>
          </Link>
          <p className="text-green-600 font-semibold text-sm mt-1">
            {product.price.toLocaleString()} đ
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-4  bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
        >
          Thêm vào giỏ hàng
        </button>
      </div>

      {/* Nút nổi bên phải */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={toggleWishlist}
          className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
        >
          <Heart
            size={18}
            className={wishlist ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}
          />
        </button>
        <button className="bg-white rounded-full p-1 shadow hover:bg-gray-100">
          <ShoppingCart onClick={handleAddToCart} size={18} className="text-green-600" />
        </button>
        <button
          onClick={() => onQuickView && onQuickView(product)}
          className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
        >
          <Eye size={18} className="text-blue-500" />
        </button>
      </div>
    </div>
  );
});
// ...existing code...
export default ProductCard;
