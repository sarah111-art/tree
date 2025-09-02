import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Mail, Menu } from 'lucide-react';
import avt from '../assets/avatar/avt.jpg';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';


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
          <Bell size={20} className="text-gray-600 hover:text-green-500 cursor-pointer" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full" />
        </div>
        <div className="relative">
          <Mail size={20} className="text-gray-600 hover:text-green-500 cursor-pointer" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full" />
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
