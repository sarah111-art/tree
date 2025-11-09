import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, User2Icon, LogOut, FileText, Menu, X } from 'lucide-react';
import { useShop, useWishlist } from '../context/ShopContext';
import axios from 'axios';
import { backendUrl } from '../context/ShopContext';
import logo from '../assets/logo/logo.png';

export default function Header() {
  const [orderCount, setOrderCount] = useState(0);
  const { token, user, setToken, setUser, cartItems, products } = useShop();
  
  // Debug log
  console.log("Header - Token:", token);
  console.log("Header - User:", user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Xử lý tìm kiếm
  useEffect(() => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    const keyword = searchTerm.toLowerCase().trim();
    const matches = products
      .filter((p) => p.name?.toLowerCase().includes(keyword))
      .slice(0, 5);

    setSuggestions(matches);
  }, [searchTerm, products]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchTerm.trim())}`);
      setSuggestions([]);
    }
  };

  // Tổng giỏ hàng
  const totalItems = Array.isArray(cartItems)
  ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
  : 0;
  const { wishlist } = useWishlist();
  //const totalWishlist = Array.isArray(wishlist) ? wishlist.length : 0;
  
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

// Lấy số lượng đơn hàng của người dùng
  useEffect(() => {
    if (user?.email) {
      axios.get(`${backendUrl}/api/orders/user/${user.email}`).then((res) => {
      setOrderCount(res.data.length);
      }).catch((err) => {
        console.error('Lỗi khi lấy số lượng đơn hàng:', err);
        setOrderCount(0);
    });
    } else {
      setOrderCount(0);
  }
}, [user]);

  return (
    <header className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white shadow-lg relative z-[9998]">
      {/* Top bar */}
      <div className="bg-green-900 py-1">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Miễn phí vận chuyển cho đơn hàng từ 500K
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>📞 Hotline: 0898 123 456</span>
              <span>📧 support@coigarden.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        {/* Desktop: Logo và Search bar cùng hàng */}
        <div className="hidden md:flex items-center justify-between mb-0">
          {/* Logo và Search bar */}
          <div className="flex items-center gap-4 flex-1">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <img 
                src={logo} 
                alt="Còi Garden Logo" 
                className="h-12 w-auto group-hover:scale-110 transition-transform duration-200"
              />
            </Link>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl">
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm Terrarium..."
                    className="w-full pl-4 pr-4 py-3 rounded-full border-0 bg-white/10 backdrop-blur-sm text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-full transition-all duration-200 backdrop-blur-sm"
                  >
                    Tìm
                  </button>
                </div>
                
                {suggestions.length > 0 && (
                  <ul className="absolute z-[9999] bg-white text-gray-800 border rounded-xl w-full mt-2 shadow-2xl max-h-60 overflow-y-auto">
                    {suggestions.map((item) => (
                      <li
                        key={item._id}
                        onClick={() => {
                          navigate(`/san-pham/${item._id}`);
                          setSearchTerm('');
                          setSuggestions([]);
                        }}
                        className="px-4 py-3 hover:bg-green-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                      >
                        <span className="font-medium">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </form>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-6">
            {/* Wishlist */}
                    <Link
              to="/yeu-thich"
              title="Yêu thích"
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm group"
            >
              <Heart className="text-pink-300 group-hover:text-pink-200 transition-colors" size={20} />
              <span className="font-medium">Yêu thích</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              to="/gio-hang" 
              title="Giỏ hàng" 
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm group"
            >
              <ShoppingCart className="text-yellow-300 group-hover:text-yellow-200 transition-colors" size={20} />
              <span className="font-medium">Giỏ hàng</span>
          {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-bounce">
              {totalItems}
            </span>
          )}
        </Link>

            {/* User Menu */}
            {!token ? (
              <Link 
                to="/dang-nhap" 
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm font-medium"
              >
                <User2Icon size={20} />
                Đăng nhập
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/don-hang" 
                  className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm group"
                >
                  <FileText className="text-blue-300 group-hover:text-blue-200 transition-colors" size={20} />
                  <span className="font-medium">Đơn hàng</span>
                  {orderCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-bounce">
                      {orderCount}
                    </span>
                  )}
                </Link>
                
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{user?.name?.[0] || user?.phone?.[0] || 'U'}</span>
                  </div>
                  <span className="font-medium text-sm">{user?.name || user?.phone || 'User'}</span>
                </div>
                
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm text-red-200 hover:text-red-100"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Đăng xuất</span>
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile: Logo, Search và Menu button cùng hàng */}
        <div className="md:hidden flex items-center gap-2 py-2">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-1 group flex-shrink-0">
            <img 
              src={logo} 
              alt="Còi Garden Logo" 
              className="h-8 w-auto group-hover:scale-110 transition-transform duration-200"
            />
          </Link>

          {/* Mobile Search */}
          <div className="flex-1 min-w-0">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full pl-3 pr-10 py-2 rounded-full border-0 bg-white/10 backdrop-blur-sm text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-all duration-200 text-xs"
              >
                Tìm
              </button>
            </form>
            
            {suggestions.length > 0 && (
              <ul className="absolute z-[9999] bg-white text-gray-800 border rounded-xl w-full mt-2 shadow-2xl max-h-60 overflow-y-auto left-0 right-0 mx-4">
                {suggestions.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => {
                      navigate(`/san-pham/${item._id}`);
                      setSearchTerm('');
                      setSuggestions([]);
                    }}
                    className="px-4 py-3 hover:bg-green-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                  >
                    <span className="font-medium">{item.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 flex-shrink-0"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-green-800/95 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              to="/yeu-thich"
              className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <Heart className="text-pink-300" size={20} />
                <span className="font-medium">Yêu thích</span>
              </div>
              {wishlist.length > 0 && (
                <span className="bg-pink-500 text-white rounded-full text-xs px-2 py-1">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/gio-hang"
              className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="text-yellow-300" size={20} />
                <span className="font-medium">Giỏ hàng</span>
              </div>
              {totalItems > 0 && (
                <span className="bg-yellow-500 text-white rounded-full text-xs px-2 py-1">
                  {totalItems}
                </span>
              )}
            </Link>

          {!token ? (
              <Link
                to="/dang-nhap"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
              <User2Icon size={20} />
                <span className="font-medium">Đăng nhập</span>
            </Link>
          ) : (
            <>
                <Link
                  to="/don-hang"
                  className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="text-blue-300" size={20} />
                    <span className="font-medium">Đơn hàng</span>
                  </div>
              {orderCount > 0 && (
                    <span className="bg-blue-500 text-white rounded-full text-xs px-2 py-1">
                  {orderCount}
                </span>
              )}
            </Link>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">{user?.name?.[0] || user?.phone?.[0] || 'U'}</span>
                  </div>
                  <span className="font-medium">{user?.name || user?.phone || 'User'}</span>
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all duration-200 text-red-200 w-full text-left"
                >
                <LogOut size={20} />
                  <span className="font-medium">Đăng xuất</span>
              </button>
            </>
          )}
          </div>
      </div>
      )}
    </header>
  );
}
