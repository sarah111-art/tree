// src/pages/Banner/BannerDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import dayjs from 'dayjs';
import { PageLoading } from '../../components/Loading';

export default function BannerDashboard() {
  const [banners, setBanners] = useState([]);
  const [position, setPosition] = useState('');
  const [filter, setFilter] = useState('active'); // active | expired | upcoming
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/banners`);
      setBanners(res.data);
    } catch (err) {
      console.error('Lỗi tải banner:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBanners = banners.filter((b) => {
    const now = new Date();
    const start = b.startDate ? new Date(b.startDate) : null;
    const end = b.endDate ? new Date(b.endDate) : null;

    const isActive = (!start || now >= start) && (!end || now <= end);
    const isExpired = end && now > end;
    const isUpcoming = start && now < start;

    const matchStatus =
      (filter === 'active' && isActive) ||
      (filter === 'expired' && isExpired) ||
      (filter === 'upcoming' && isUpcoming);

    const matchPosition = position ? b.position === position : true;

    return matchStatus && matchPosition;
  });

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">🎯 Bảng điều khiển Banner</h2>

      <div className="flex flex-wrap gap-4 items-center">
        <select
          className="border p-2 rounded"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          <option value="">-- Tất cả vị trí --</option>
          <option value="homepage">Trang chủ</option>
          <option value="promotion">Khuyến mãi</option>
          <option value="sidebar">Sidebar</option>
          <option value="footer">Footer</option>
        </select>

        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="active">🎯 Đang hoạt động</option>
          <option value="upcoming">⏳ Sắp hiển thị</option>
          <option value="expired">❌ Hết hạn</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {filteredBanners.map((b) => (
          <div key={b._id} className="border rounded shadow p-3 space-y-2">
            <img src={b.image} alt={b.title} className="w-full h-40 object-cover rounded" />
            <div className="font-semibold text-lg">{b.title}</div>
            <div className="text-sm text-gray-600">
              📅 {dayjs(b.startDate).format('DD/MM/YYYY')} → {dayjs(b.endDate).format('DD/MM/YYYY')}
            </div>
            <div className="text-sm">
              📍 <span className="text-blue-600 font-medium">{b.position}</span>
            </div>
            {b.link && (
              <a
                href={b.link}
                target="_blank"
                className="block text-sm text-blue-500 underline"
              >
                🔗 {b.link}
              </a>
            )}
          </div>
        ))}
        {filteredBanners.length === 0 && (
          <div className="text-gray-500 col-span-full text-center py-6">
            Không có banner phù hợp.
          </div>
        )}
      </div>
    </div>
  );
}
