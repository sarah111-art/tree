import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Mail } from 'lucide-react';
import avt from '../assets/avatar/avt.jpg';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
  navigate('/admin/login');
};


  const handleProfile = () => {
    navigate('/admin/profile');
  }; 

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-40 w-full">
      {/* Logo + Search */}
      <div className="flex items-center gap-4">
        <img src={logo} alt="Logo" className="w-[100px] hidden sm:block rounded-md" />
        <div className="relative w-44 sm:w-60 md:w-72">
          <input
            type="text"
            placeholder="Search here..."
            className="w-full border border-green-300 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
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
