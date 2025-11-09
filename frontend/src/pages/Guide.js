// src/pages/CamNangPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../context/ShopContext'; // hoặc từ App nếu bạn export backendUrl ở đó
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

export default function CamNangPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/posts`);
        setPosts(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy bài viết:', err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-green-700 mb-6">🌿 Cẩm Nang Chăm Sóc Terrarium</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map(post => (
          <div key={post._id} className="bg-white rounded shadow p-4 flex flex-col hover:shadow-md transition">
            <img src={post.image || '/placeholder.jpg'} alt={post.title} className="w-full h-48 object-cover rounded" />
            <h2 className="mt-3 text-lg font-semibold text-green-800">{post.title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {dayjs(post.createdAt).format('DD/MM/YYYY')}
            </p>
            <div
              className="text-sm text-gray-700 line-clamp-3 mt-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <Link
              to={`/bai-viet/${post._id}`}
              className="mt-3 inline-block text-green-600 hover:underline text-sm"
            >
              Xem chi tiết →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
