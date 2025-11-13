import React from 'react';

export default function CornerDecor() {
  return (
    <>
      {/* Ảnh trang trí góc trên trái - Demo với logo */}
      <img 
        src="/rhaphidophora_tetrasperma-removebg-preview.png" 
        alt="corner decoration top left" 
        className="corner-decor top-left"
        onError={(e) => {
          // Fallback nếu ảnh không tồn tại - dùng placeholder
          e.target.src = 'https://via.placeholder.com/180x180/22c55e/ffffff?text=Leaf+Top';
        }}
      />
      
      {/* Ảnh trang trí giữa phải - Demo với placeholder */}
      <img 
        src="/cay-canh-removebg-preview.png" 
        alt="corner decoration center right" 
        className="corner-decor center-right"
        onError={(e) => {
          // Fallback nếu ảnh không tồn tại
          e.target.style.display = 'none';
        }}
      />
      
      {/* Ảnh trang trí góc dưới trái - Demo với logo */}
      <img 
        src="/cay-day-leo.png" 
        alt="corner decoration bottom left" 
        className="corner-decor bottom-left"
        onError={(e) => {
          // Fallback nếu ảnh không tồn tại - dùng placeholder
          e.target.src = 'https://via.placeholder.com/180x180/22c55e/ffffff?text=Leaf+Bottom';
        }}
      />
    </>
  );
}

