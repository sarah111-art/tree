import React from 'react';

const ButtonLoading = ({ 
  loading = false, 
  children, 
  disabled = false, 
  className = '', 
  onClick,
  type = 'button',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
        transition-all duration-200
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span>Đang xử lý...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonLoading;
