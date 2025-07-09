import React from 'react';

const Topbar = () => {
  return (
    <div className="ml-64 h-16 px-6 bg-white border-b flex items-center justify-between">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="text-gray-700">Xin chào, Admin</div>
    </div>
  );
};

export default Topbar;
