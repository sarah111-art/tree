import React from 'react';

export default function QuickView({ product, onClose }) {
  if (!product) return null;

  const displayImage = product.image || product.images?.[0]?.url || '/placeholder.jpg';

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl relative animate-fade-in transition-transform scale-100">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-2xl font-bold"
        >
          ×
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Ảnh sản phẩm (với nhiều ảnh nếu có) */}
          <div className="flex-1">
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg shadow"
            />
            {product.images?.length > 1 && (
              <div className="flex gap-2 mt-2">
                {product.images.slice(0, 4).map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`ảnh ${idx}`}
                    className="w-14 h-14 object-cover rounded border hover:ring-2 ring-green-500 cursor-pointer"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thông tin */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
              <p className="text-green-600 font-semibold text-xl">
                {product.salePrice > 0
                  ? `${product.salePrice.toLocaleString()} đ`
                  : `${product.price.toLocaleString()} đ`}
              </p>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed line-clamp-5">
                {product.shortDescription || product.description}
              </p>
            </div>

            {/* Hành động */}
            <div className="mt-6 flex gap-4 items-center">
              <button className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition">
                Thêm vào giỏ
              </button>
              <a
                href={`/san-pham/${product._id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Xem chi tiết →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
