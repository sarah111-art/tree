import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
      <div className="text-green-500">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
