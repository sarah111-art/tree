// src/components/PromoBanner.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api';
import { backendUrl } from '../App';

export default function PromoBanner() {
  const [promo, setPromo] = useState(null);

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

  if (!promo) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-300 to-orange-400 text-center py-3 text-lg font-bold text-red-900 shadow-md">
      {promo.link ? (
        <a href={promo.link} className="hover:underline" target="_blank" rel="noreferrer">
          {promo.title}
        </a>
      ) : (
        <span>{promo.title}</span>
      )}
    </div>
  );
}
