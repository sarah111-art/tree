import React from 'react';

const Loading = ({ size = 'md', text = 'Đang tải...', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-green-500 ${sizeClasses[size]}`}></div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );
};

// Loading cho table
export const TableLoading = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    <p className="mt-3 text-sm text-gray-600">Đang tải dữ liệu...</p>
  </div>
);

// Loading cho card
export const CardLoading = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
      <p className="mt-2 text-sm text-gray-600">Đang tải...</p>
    </div>
  </div>
);

// Loading cho button
export const ButtonLoading = ({ text = 'Đang xử lý...' }) => (
  <div className="flex items-center gap-2">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
    <span>{text}</span>
  </div>
);

// Loading cho page
export const PageLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    <p className="mt-4 text-lg text-gray-700 font-medium">Đang tải trang...</p>
    <p className="mt-2 text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
  </div>
);

// Loading cho modal
export const ModalLoading = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    <p className="mt-3 text-sm text-gray-600">Đang xử lý...</p>
  </div>
);

export default Loading;
