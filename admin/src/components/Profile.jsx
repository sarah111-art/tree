import React from 'react';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('adminInfo'));

  if (!user) return <p className="text-center mt-10">Không tìm thấy người dùng.</p>;

  return (
    <div className="max-w-md mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Thông tin tài khoản</h2>

      <div className="space-y-3 text-gray-700">
        <p><strong>👤 Tên:</strong> {user.name}</p>
        <p><strong>📧 Email:</strong> {user.email}</p>
        <p><strong>🔐 Vai trò:</strong> 
          <span className={`ml-1 px-2 py-0.5 text-sm rounded ${user.role === 'manager' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {user.role}
          </span>
        </p>
        <p><strong>🕓 Ngày tạo:</strong> {new Date(user.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
