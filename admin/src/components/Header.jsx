import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Mail, Menu } from 'lucide-react';
import avt from '../assets/avatar/avt.jpg';
import logo from '../assets/logo/logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';


const Header = ({ onOpenSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const menuRef = useRef();
  const searchRef = useRef();
  const searchTimeoutRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
  navigate('/admin/login');
};


  const handleProfile = () => {
    navigate('/admin/profile');
  }; 

  // Search functionality with debounce
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    // Set loading state
    setIsSearching(true);
    setShowSearchResults(true);

    // Debounce search - wait 300ms after user stops typing
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found for search');
          setSearchResults([]);
          setIsSearching(false);
          return;
        }

        // Call real API with proper headers
        const response = await fetch(`https://tree-mmpq.onrender.com/api/search?query=${encodeURIComponent(query)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Search API response:', data);
          
          if (data.results && Array.isArray(data.results)) {
            setSearchResults(data.results);
          } else {
            setSearchResults([]);
          }
        } else {
          console.error('Search API error:', response.status, response.statusText);
          setSearchResults([]);
        }
      } catch (error) {
        console.error('❌ Lỗi search:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSearchResultClick = (result) => {
    navigate(result.path);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const getSearchIcon = (type) => {
    switch (type) {
      case 'product': return '📦';
      case 'order': return '📋';
      case 'category': return '📁';
      case 'user': return '👤';
      default: return '🔍';
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Cleanup timeout on unmount
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Socket.IO - thông báo đơn hàng mới
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const [lastOrderInfo, setLastOrderInfo] = useState(null);
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  // Contacts panel/state
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [recentContacts, setRecentContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [hasUnreadContact, setHasUnreadContact] = useState(false);

  useEffect(() => {
    // Kết nối socket chỉ khi đã đăng nhập
    const token = localStorage.getItem('token');
    if (!token) return;

    // lazy import để tránh thêm lib vào bundle nếu không cần
    let socket;
    import('socket.io-client').then(({ io }) => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin;
      socket = io(backendUrl, { transports: ['websocket'], autoConnect: true });

      socket.on('connect', () => {
        console.log('🔌 Socket connected', socket.id);
      });

      socket.on('order:new', (payload) => {
        setHasNewOrder(true);
        setLastOrderInfo(payload);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
      });
    });

    return () => {
      try { socket && socket.disconnect(); } catch {}
    };
  }, []);

  const clearNewOrder = () => setHasNewOrder(false);

  const fetchRecentOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await axios.get(`${backendUrl}/api/orders`, {
        params: { page: 1, limit: 10 },
      });
      // API trả về { orders, total, ... }
      setRecentOrders(res.data.orders || []);
    } catch (e) {
      console.error('❌ Lỗi lấy đơn hàng mới:', e);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleBellClick = () => {
    const next = !showOrderPanel;
    setShowOrderPanel(next);
    if (next) {
      clearNewOrder();
      fetchRecentOrders();
    }
  };

  const fetchRecentContacts = async () => {
    try {
      setContactsLoading(true);
      const res = await axios.get(`${backendUrl}/api/contacts`, {
        params: { page: 1, limit: 10 },
      });
      const list = res.data.data || [];
      setRecentContacts(list);
      setHasUnreadContact(list.some((c) => c.status === 'pending'));
    } catch (e) {
      console.error('❌ Lỗi lấy liên hệ mới:', e);
    } finally {
      setContactsLoading(false);
    }
  };

  const handleMailClick = () => {
    const next = !showContactPanel;
    setShowContactPanel(next);
    if (next) {
      fetchRecentContacts();
    }
  };

  // Kiểm tra định kỳ liên hệ chưa đọc (mỗi 30s)
  useEffect(() => {
    fetchRecentContacts();
    const t = setInterval(fetchRecentContacts, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-40 w-full">
      {/* Mobile Menu Button + Logo + Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <img src={logo} alt="Logo" className="w-[100px] hidden sm:block rounded-md" />
        <div className="relative w-44 sm:w-60 md:w-72" ref={searchRef}>
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full border border-green-300 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          
                    {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {isSearching ? (
                <div className="px-4 py-3 text-gray-500 text-sm flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                  Đang tìm kiếm...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleSearchResultClick(result)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-lg">{result.icon || getSearchIcon(result.type)}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{result.title}</div>
                      <div className="text-xs text-gray-500">{result.subtitle || result.type}</div>
                    </div>
                  </div>
                ))
              ) : searchQuery.trim() !== '' ? (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  Không tìm thấy kết quả cho "{searchQuery}"
                </div>
              ) : null}
            </div>
          )}
          

        </div>
      </div>

      {/* Icons + Avatar */}
      <div className="flex items-center gap-4 relative" ref={menuRef}>
        <div className="relative">
          <button onClick={handleBellClick} className="relative">
          <Bell size={20} className="text-gray-600 hover:text-green-500 cursor-pointer" />
            {hasNewOrder && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full" />}
          </button>
          {(showOrderPanel) && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-80 z-50">
              <div className="px-4 py-2 border-b flex items-center justify-between">
                <div className="font-medium">Đơn hàng mới nhất</div>
                <button onClick={() => setShowOrderPanel(false)} className="text-xs text-gray-500 hover:text-gray-700">Đóng</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {ordersLoading ? (
                  <div className="px-4 py-6 text-sm text-gray-500">Đang tải...</div>
                ) : recentOrders.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-gray-500">Chưa có đơn hàng</div>
                ) : (
                  recentOrders.map((o) => (
                    <div key={o._id} className="px-4 py-3 border-b last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">#{String(o._id).slice(-6)}</div>
                        <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString('vi-VN')}</div>
                      </div>
                      <div className="mt-1 text-sm text-gray-700 truncate">{o.customer?.name || 'Khách lẻ'}</div>
                      <div className="text-sm font-semibold text-green-600">{Number(o.total||0).toLocaleString()} đ</div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 border-t bg-gray-50 flex items-center justify-between">
                {lastOrderInfo && (
                  <div className="text-xs text-gray-500 truncate">Mới: #{String(lastOrderInfo.id).slice(-6)}</div>
                )}
                <button
                  onClick={() => { setShowOrderPanel(false); navigate('/admin/orders'); }}
                  className="text-sm text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                >
                  Xem tất cả
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button onClick={handleMailClick} className="relative">
          <Mail size={20} className="text-gray-600 hover:text-green-500 cursor-pointer" />
            {hasUnreadContact && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          {showContactPanel && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-80 z-50">
              <div className="px-4 py-2 border-b flex items-center justify-between">
                <div className="font-medium">Liên hệ gần đây</div>
                <button onClick={() => setShowContactPanel(false)} className="text-xs text-gray-500 hover:text-gray-700">Đóng</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {contactsLoading ? (
                  <div className="px-4 py-6 text-sm text-gray-500">Đang tải...</div>
                ) : recentContacts.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-gray-500">Chưa có liên hệ</div>
                ) : (
                  recentContacts.map((c) => (
                    <div key={c._id} className="px-4 py-3 border-b last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium truncate">{c.name || 'Khách'}</div>
                        <span className={`text-xs px-2 py-0.5 rounded ${c.status === 'processed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {c.status === 'processed' ? 'Đã xử lý' : 'Chưa đọc'}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">{new Date(c.createdAt).toLocaleString('vi-VN')}</div>
                      <div className="mt-1 text-sm text-gray-700 truncate">{c.message}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 border-t bg-gray-50 flex items-center justify-end">
                <button
                  onClick={() => { setShowContactPanel(false); navigate('/admin/contact'); }}
                  className="text-sm text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                >
                  Xem tất cả
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="relative">
          <img
            src={avt}
            alt="avatar"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full border-2 border-white shadow cursor-pointer"
          />

          {/* Dropdown menu */}
          <div className={`absolute right-0 mt-2 w-40 bg-white rounded-md shadow-md border z-50 transition-all duration-200 transform ${menuOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}>
            <ul className="text-sm text-gray-700">
              <li onClick={handleProfile} className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                👤 Profile <span className="text-green-500 text-xs">✓</span>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">⚙️ Settings</li>
              <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">🚪 Logout</li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
