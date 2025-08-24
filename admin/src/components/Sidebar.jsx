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
  const isManager = user?.role === 'manager';

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
      className={`flex items-center gap-3 px-4 py-1 rounded-lg transition-all duration-200 hover:bg-green-700 hover:text-white group menu-item-hover ${
        isActive ? 'bg-green-700 text-white shadow-lg menu-item-active' : 'text-green-100 hover:bg-green-700'
      }`}
      style={{ margin: '0', borderRadius: '0' }}
    >
      <Icon size={20} className="group-hover:scale-110 transition-transform" />
      <span className="font-medium">{children}</span>
    </Link>
  );

  const DropdownItem = ({ icon: Icon, children, isOpen, onClick, subItems }) => (
    <div style={{ margin: '0' }}>
      <button
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className="flex items-center justify-between w-full px-4 py-1 rounded-lg transition-all duration-200 hover:bg-green-700 hover:text-white group text-green-100"
        style={{ margin: '0', borderRadius: '0' }}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium">{children}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
                      <div className={`transition-all duration-300 ease-in-out dropdown-content ${
          isOpen ? 'open' : ''
        }`}>
          <div className="ml-8">
            {subItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="block px-3 py-1 text-sm rounded-md transition-all duration-200 hover:bg-green-600 hover:text-white text-green-200 menu-item-hover"
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
        fixed top-0 left-0 h-full bg-gradient-to-b from-green-800 to-green-900 text-white z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative
        w-72 shadow-2xl
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="font-bold text-xl">Bonsai Admin</h1>
              <p className="text-xs text-green-300">Management Panel</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-green-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Users size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{user?.name || 'Admin'}</p>
              <p className="text-xs text-green-300 capitalize">{user?.role || 'user'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto sidebar-scroll max-h-[calc(100vh-200px)]" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
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
              { to: '/admin/products', label: '📦 Danh sách người dùng' },
              { to: '/admin/products/add', label: '➕ Xem chi tiết' },
              { to: '/admin/products/add', label: '➕ Khóa/mở tài khoản' }
            ]}
          >
            Quản lý Người Dùng
          </DropdownItem>

          {/* Statistics */}
          <MenuItem 
            to="/admin/users" 
            icon={ChartAreaIcon}
            isActive={location.pathname === '/admin/users'}
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
                  { to: '/admin/qr', label: '➕ Cấu hình thanh toán' }
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
        <div className="p-4 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-600 hover:text-white text-green-100 group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;