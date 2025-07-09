// src/components/ScheduledBanner.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

export default function ScheduledBanner() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    axios.get(`${backendUrl}/api/banners?position=homepage`)
      .then((res) => {
        const now = new Date();
        const filtered = res.data.filter((b) => {
          const start = b.startDate ? new Date(b.startDate) : null;
          const end = b.endDate ? new Date(b.endDate) : null;
          return (!start || now >= start) && (!end || now <= end);
        });
        setBanners(filtered);
      })
      .catch((err) => console.error('Lỗi tải banner lịch trình:', err));
  }, []);

  if (banners.length === 0) return null;

  return (
    <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
      {banners.map((b) => (
        <div key={b._id} className="border rounded overflow-hidden shadow">
          <img src={b.image} alt={b.title} className="w-full h-48 object-cover" />
          <div className="p-3 font-semibold">{b.title}</div>
        </div>
      ))}
    </div>
  );
}
