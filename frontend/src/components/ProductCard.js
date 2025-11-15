import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Eye, Search, Heart } from 'lucide-react';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useWishlist } from '../context/ShopContext';

const ProductCard = React.memo(({ product, onQuickView, size = 'normal' }) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isLiked = wishlist.some((item) => item._id === product._id);
  
  const isCompact = size === 'compact' || size === 'small';

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden h-full flex flex-col cursor-pointer">
      {/* Ảnh sản phẩm */}
      <Link to={`/san-pham/${product._id}`} className="relative overflow-hidden flex-shrink-0 bg-gray-100">
        <LazyLoadImage
          src={product.image || product.images?.[0]?.url}
          alt={product.name}
          effect="blur"
          className={`w-full ${isCompact ? 'h-32' : 'aspect-square'} object-cover`}
        />
        
        {/* Action buttons - hiển thị khi hover */}
        {!isCompact && (
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={toggleWishlist}
              className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              title="Yêu thích"
            >
              <Heart 
                size={16} 
                className={isLiked ? 'text-pink-500 fill-pink-500' : 'text-gray-700'} 
              />
            </button>
            <button
              onClick={handleQuickView}
              className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              title="Xem nhanh"
            >
              <Eye size={16} className="text-gray-700" />
            </button>
            <Link
              to={`/san-pham/${product._id}`}
              className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              title="Tìm"
            >
              <Search size={16} className="text-gray-700" />
            </Link>
          </div>
        )}
      </Link>

      {/* Nội dung */}
      <div className={`${isCompact ? 'p-2' : 'p-3'} flex flex-col flex-1`}>
        <Link to={`/san-pham/${product._id}`}>
          <h3 className={`${isCompact ? 'text-xs' : 'text-sm'} font-medium text-gray-800 mb-1 line-clamp-2 hover:text-green-600 transition-colors`}>
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          {product.salePrice > 0 ? (
            <>
              <span className={`${isCompact ? 'text-xs' : 'text-base'} font-semibold text-gray-900`}>
                {product.salePrice.toLocaleString()}₫
              </span>
              <span className={`${isCompact ? 'text-[10px]' : 'text-xs'} text-gray-400 line-through`}>
                {product.price.toLocaleString()}₫
              </span>
            </>
          ) : (
            <span className={`${isCompact ? 'text-xs' : 'text-base'} font-semibold text-gray-900`}>
              {product.price.toLocaleString()}₫
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
