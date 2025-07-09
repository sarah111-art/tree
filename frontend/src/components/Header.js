import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Search, ShoppingCart, User2Icon, LogOut, FileText } from 'lucide-react';
import { useShop, useWishlist } from '../context/ShopContext';
import axios from 'axios';
import { backendUrl } from '../context/ShopContext';
export default function Header() {
  const [orderCount, setOrderCount] = useState(0);
  const { token, user, setToken, setUser, cartItems, products } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);


// Xử lý tìm kiếm

  useEffect(() => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    const keyword = searchTerm.toLowerCase().trim();
    const matches = products
      .filter((p) => p.name?.toLowerCase().includes(keyword))
      .slice(0, 5); // giới hạn 5 gợi ý

    setSuggestions(matches);
  }, [searchTerm, products]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchTerm.trim())}`);
      setSuggestions([]);
    }
  };

//tong gion hang
  const totalItems = Array.isArray(cartItems)
  ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
  : 0;
  const { wishlist } = useWishlist();
  const totalWishlist = Array.isArray(wishlist) ? wishlist.length : 0;
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token'); // nếu bạn lưu token
  };
// Lấy số lượng đơn hàng của người dùng

  useEffect(() => {
  if (user?.phone) {
    axios.get(`${backendUrl}/api/orders/user/${user.phone}`).then((res) => {
      setOrderCount(res.data.length);
    });
  }
}, [user]);
  return (
    <header className="bg-green-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          Bonsai Việt
        </Link>

        {/* Tìm kiếm */}
       {/* Tìm kiếm */}
<form onSubmit={handleSubmit} className="relative w-full max-w-md mx-4 flex-1">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Tìm cây bonsai..."
    className="w-full pl-10 pr-3 py-1 rounded border border-gray-300 text-black focus:outline-none"
  />
  {suggestions.length > 0 && (
    <ul className="absolute z-50 bg-white text-black border rounded w-full mt-1 shadow">
      {suggestions.map((item) => (
        <li
          key={item._id}
          onClick={() => {
            navigate(`/san-pham/${item._id}`);
            setSearchTerm('');
            setSuggestions([]);
          }}
          className="px-3 py-2 hover:bg-green-100 cursor-pointer text-sm"
        >
          {item.name}
        </li>
      ))}
    </ul>
  )}
</form>


        {/* Menu icons */}
        <nav className="flex items-center space-x-4">

                    <Link
              to="/yeu-thich"
              title="Yêu thích"
              className="relative flex items-center gap-1 text-sm sm:text-base hover:underline"
            >
              <span className="text-lg sm:text-xl">💚</span>
              <span className="hidden sm:inline">Yêu thích</span>

              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2">
                  {wishlist.length}
                </span>
              )}
            </Link>
              <Link to="/gio-hang" title="Giỏ hàng" className="relative hover:underline flex items-center gap-1">
          <ShoppingCart size={20} /> <span className="hidden sm:inline">Giỏ hàng</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2">
              {totalItems}
            </span>
          )}
        </Link>


          {!token ? (
            <Link to="/dang-nhap" className="hover:underline flex items-center gap-1">
              <User2Icon size={20} />
              <span className="hidden sm:inline">Đăng Nhập</span>
            </Link>
          ) : (
            <>
            <Link to="/don-hang" className="hover:underline flex items-center gap-1 relative">
              <FileText size={20} />
              <span className="hidden sm:inline">Đơn hàng</span>
              {orderCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2">
                  {orderCount}
                </span>
              )}
            </Link>
              <button onClick={handleLogout} className="hover:underline flex items-center gap-1">
                <LogOut size={20} />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
