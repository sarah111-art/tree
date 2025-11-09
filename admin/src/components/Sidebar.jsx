import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  ChevronDown, 
  Boxes, 
  Image, 
  ListOrdered, 
  ChartAreaIcon, 
  PhoneCall, 
  ImageIcon, 
  LucidePodcast, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { TbBrandIntercom, TbCategory, TbCategoryFilled } from 'react-icons/tb';
import { FaProductHunt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, token, setToken }) => {
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [orderMenuOpen, setOrderMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [bannerMenuOpen, setBannerMenuOpen] = useState(false);
  const [postMenuOpen, setPostMenuOpen] = useState(false);

  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('adminInfo'));
  const isManager = (user?.role || '').toLowerCase() === 'manager';

  // Close mobile menu when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminInfo');
    setToken('');
  };

  const MenuItem = ({ to, icon: Icon, children, isActive }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-green-700/50 hover:text-white group menu-item-hover ${
        isActive ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg menu-item-active' : 'text-green-100 hover:bg-green-700/50'
      }`}
      style={{ margin: '0', borderRadius: '0' }}
    >
      <Icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
      <span className="font-semibold">{children}</span>
    </Link>
  );

  const DropdownItem = ({ icon: Icon, children, isOpen, onClick, subItems }) => (
    <div style={{ margin: '0' }}>
      <button
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 hover:bg-green-700/50 hover:text-white group text-green-100"
        style={{ margin: '0', borderRadius: '0' }}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
          <span className="font-semibold">{children}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`transition-all duration-300 ease-in-out dropdown-content ${
        isOpen ? 'open' : ''
      }`}>
        <div className="ml-8 space-y-1">
          {subItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="block px-4 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-green-600/50 hover:text-white text-green-200 menu-item-hover font-medium"
              style={{ margin: '0', borderRadius: '0' }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden mobile-overlay"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white z-50
        transform transition-all duration-300 ease-in-out backdrop-blur-sm
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:fixed
        w-64 shadow-2xl border-r border-green-600/20
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-600/30 bg-green-800/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">Còi Garden Admin</h1>
              <p className="text-xs text-green-300 font-medium">Management Panel</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-green-700/50 transition-all duration-200 hover:scale-105"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-green-600/30 bg-green-800/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
              <Users size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-white">{user?.name || 'Admin'}</p>
              <p className="text-xs text-green-300 capitalize font-medium">{user?.role || 'user'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto sidebar-scroll max-h-[calc(100vh-200px)] bg-green-800/5" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {/* Dashboard */}
          <MenuItem 
            to="/admin/dashboard" 
            icon={LayoutDashboard}
            isActive={location.pathname === '/admin/dashboard'}
          >
            Dashboard
          </MenuItem>

          {/* Products */}
          <DropdownItem
            icon={FaProductHunt}
            isOpen={productMenuOpen}
            onClick={() => setProductMenuOpen(!productMenuOpen)}
            subItems={[
              { to: '/admin/products', label: '📦 Tất cả sản phẩm' },
              { to: '/admin/products/add', label: '➕ Thêm sản phẩm' },
              { to: '/admin/products/stock', label: '📊 Quản lý kho' }
            ]}
          >
            Quản lý Sản phẩm
          </DropdownItem>

          {/* Categories */}
          <DropdownItem
            icon={TbCategoryFilled}
            isOpen={categoryMenuOpen}
            onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
            subItems={[
              { to: '/admin/categories', label: '📦 Quản lý danh mục' }
            ]}
          >
            Quản lý Danh mục
          </DropdownItem>

          {/* Orders */}
          <DropdownItem
            icon={ListOrdered}
            isOpen={orderMenuOpen}
            onClick={() => setOrderMenuOpen(!orderMenuOpen)}
            subItems={[
              { to: '/admin/orders', label: '📦 Tất cả đơn hàng' }
            ]}
          >
            Quản lý Đơn hàng
          </DropdownItem>

          {/* Banners */}
          <DropdownItem
            icon={ImageIcon}
            isOpen={bannerMenuOpen}
            onClick={() => setBannerMenuOpen(!bannerMenuOpen)}
            subItems={[
              { to: '/admin/banners/add', label: '📦 Quản lý Banner' },
              { to: '/admin/banners/dashboard', label: '➕ Thống kê Banner' }
            ]}
          >
            Quản lý Banner
          </DropdownItem>

          {/* Posts */}
          <DropdownItem
            icon={LucidePodcast}
            isOpen={postMenuOpen}
            onClick={() => setPostMenuOpen(!postMenuOpen)}
            subItems={[
              { to: '/admin/posts', label: '📦 Danh sách bài viết' }
            ]}
          >
            Quản lý Bài Viết
          </DropdownItem>

          {/* Users */}
          <DropdownItem
            icon={TbCategoryFilled}
            isOpen={userMenuOpen}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            subItems={[
              { to: '/admin/users', label: '📦 Danh sách người dùng' }
            ]}
          >
            Quản lý Người Dùng
          </DropdownItem>

          {/* Statistics */}
          <MenuItem 
            to="/admin/report" 
            icon={ChartAreaIcon}
            isActive={location.pathname === '/admin/report'}
          >
            Thống kê & Báo cáo
          </MenuItem>

          {/* Manager Only Sections */}
        {isManager && (
            <>
              {/* Staff Management */}
              <DropdownItem
                icon={FaProductHunt}
                isOpen={roleMenuOpen}
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                subItems={[
                  { to: '/admin/staffs', label: '📦 Tất cả Staff' },
                  { to: '/admin/register', label: '📦 Tạo tài khoản Staff' },
                  { to: '/admin/activity-logs', label: '➕ Theo dõi lịch sử' }
                ]}
              >
                Phân quyền & Bảo mật
              </DropdownItem>

              {/* Settings */}
              <DropdownItem
                icon={Settings}
                isOpen={settingsMenuOpen}
                onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
                subItems={[
                  { to: '/admin/qr', label: '➕ Cấu hình thanh toán' },
                  { to: '/admin/footers', label: '📄 Quản lý Footer' }
                ]}
              >
                Cài Đặt Hệ thống
              </DropdownItem>
            </>
          )}

          {/* Contact */}
          <MenuItem 
            to="/admin/contact" 
            icon={PhoneCall}
            isActive={location.pathname === '/admin/contact'}
          >
            Quản lý Liên Hệ
          </MenuItem>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-green-600/30 bg-green-800/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white text-green-100 group shadow-sm"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold">Đăng xuất</span>
          </button>
        </div>
            </div>
    </>
  );
};

export default Sidebar;