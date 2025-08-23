import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Heart, ShoppingCart, Eye, Star, Check, X } from 'lucide-react';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useShop, useWishlist } from '../context/ShopContext';

const ProductCard = React.memo(({ product, onQuickView }) => {
  const { addToCart } = useShop();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [showCartToast, setShowCartToast] = useState(false);
  const [showWishlistToast, setShowWishlistToast] = useState(false);
  
  //add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Ngăn chặn event bubbling
    addToCart(product, 1);
    
    // Hiển thị thông báo
    setShowCartToast(true);
    setTimeout(() => setShowCartToast(false), 3000);
  };
  
  // Thêm vào yêu thích
  const isLiked = wishlist.some((item) => item._id === product._id);  
  const toggleWishlist = (e) => {
    e.stopPropagation(); // Ngăn chặn event bubbling
    if (isLiked) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
      // Hiển thị thông báo chỉ khi thêm vào yêu thích
      setShowWishlistToast(true);
      setTimeout(() => setShowWishlistToast(false), 3000);
    }
  };

  // Click vào card để chuyển đến trang chi tiết
  const handleCardClick = () => {
    navigate(`/san-pham/${product._id}`);
  };

  // Click vào quick view
  const handleQuickView = (e) => {
    e.stopPropagation(); // Ngăn chặn event bubbling
    onQuickView && onQuickView(product);
  };

  return (
    <>
      <div 
        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col transform hover:-translate-y-1 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Sale badge */}
        {product.salePrice > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
            </span>
          </div>
        )}

        {/* Ảnh sản phẩm */}
        <div className="relative overflow-hidden flex-shrink-0">
          <LazyLoadImage
            src={product.image || product.images?.[0]?.url}
            alt={product.name}
            effect="blur"
            className="w-full aspect-square object-cover transform group-hover:scale-110 transition duration-500"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Nội dung */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors duration-200">
              {product.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={`${star <= (product.ratings?.length > 0 ? 
                      product.ratings.reduce((sum, r) => sum + r.star, 0) / product.ratings.length : 0) 
                      ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({product.ratings?.length || 0})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              {product.salePrice > 0 ? (
                <>
                  <span className="text-lg font-bold text-green-600">
                    {product.salePrice.toLocaleString()} đ
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {product.price.toLocaleString()} đ
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-green-600">
                  {product.price.toLocaleString()} đ
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-auto product-card-button">
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              Thêm vào giỏ
            </button>
          </div>
        </div>

        {/* Floating action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button
            onClick={toggleWishlist}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
          >
            <Heart
              size={16}
              className={isLiked ? 'text-pink-500 fill-pink-500' : 'text-gray-600 hover:text-pink-500'}
            />
          </button>
          <button
            onClick={handleQuickView}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
          >
            <Eye size={16} className="text-gray-600 hover:text-blue-500" />
          </button>
        </div>
      </div>

      {/* Toast thông báo thêm vào giỏ hàng */}
      {showCartToast && (
        <div className="fixed top-4 right-4 z-[9999] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right duration-300">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <Check size={14} className="text-green-500" />
          </div>
          <div>
            <p className="font-medium">Đã thêm vào giỏ hàng!</p>
            <p className="text-sm opacity-90">{product.name}</p>
          </div>
          <button
            onClick={() => setShowCartToast(false)}
            className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Toast thông báo thêm vào yêu thích */}
      {showWishlistToast && (
        <div className="fixed top-4 right-4 z-[9999] bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right duration-300">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <Heart size={14} className="text-pink-500 fill-pink-500" />
          </div>
          <div>
            <p className="font-medium">Đã thêm vào yêu thích!</p>
            <p className="text-sm opacity-90">{product.name}</p>
          </div>
          <button
            onClick={() => setShowWishlistToast(false)}
            className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
});

export default ProductCard;
