// src/components/PromoBanner.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { Sparkles, X } from 'lucide-react';

export default function PromoBanner() {
  const [promo, setPromo] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/banners?position=promotion`);
        const now = new Date();

        const validBanner = res.data.find(b => {
          const start = b.startDate ? new Date(b.startDate) : null;
          const end = b.endDate ? new Date(b.endDate) : null;
          return (!start || start <= now) && (!end || end >= now);
        });

        setPromo(validBanner);
      } catch (err) {
        console.error('Lỗi khi lấy banner khuyến mãi:', err);
      }
    };

    fetchBanner();
  }, []);

  if (!promo || !isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 text-center py-4 shadow-lg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-orange-300/20 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="text-white animate-pulse" size={20} />
          <div className="flex-1">
            {promo.link ? (
              <a 
                href={promo.link} 
                className="text-white font-bold text-lg hover:text-yellow-200 transition-colors duration-200 flex items-center justify-center gap-2" 
                target="_blank" 
                rel="noreferrer"
              >
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  🔥 KHuyẾN MÃI
                </span>
                {promo.title}
                <span className="text-yellow-200 text-sm">→ Xem ngay</span>
              </a>
            ) : (
              <span className="text-white font-bold text-lg flex items-center justify-center gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  🔥 KHuyẾN MÃI
                </span>
                {promo.title}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
