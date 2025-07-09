import React, { useState } from 'react';
import { LayoutDashboard, ShoppingCart, Users, ChevronDown, Boxes, Image, ListOrdered, ChartAreaIcon, PhoneCall, ImageIcon, LucidePodcast,Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TbBrandIntercom, TbCategory, TbCategoryFilled, TbHttpPost, TbSquareRoundedChevronRight } from 'react-icons/tb';
import { FaProductHunt } from 'react-icons/fa';

const Sidebar = () => {
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [OrderMenuOpen, setOrderMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [bannerMenuOpen, setBannerMenuOpen] = useState(false);
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  return (
    <div className="w-64 h-screen bg-green-800 text-white fixed top-0 left-0 flex flex-col">
      <div className="p-6 font-bold text-2xl border-b border-green-700">
        Bonsai Admin
      </div>

      <nav className="flex-1 p-4 space-y-4">

        {/* Dashboard */}
         <Link to="/admin" className="flex items-center gap-2 hover:text-green-400">
          <LayoutDashboard size={20} /> Dashboard
         </Link>
        {/* Sản phẩm Dropdown */}
        <div>
          <div
            onClick={() => setProductMenuOpen(!productMenuOpen)}
            className="flex items-center justify-between gap-2 cursor-pointer hover:text-green-400"
          >
            <div className="flex items-center gap-2">
              <FaProductHunt size={20} />Quản lý Sản phẩm
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${productMenuOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {productMenuOpen && (
            <div className="ml-6 mt-2 space-y-2 text-sm">
              <Link to="/admin/products" className="block hover:text-green-300">📦 Tất cả sản phẩm</Link>
              <Link to="/admin/products/add" className="block hover:text-green-300">➕ Thêm sản phẩm</Link>
              <Link to="/admin/products/stock" className="block hover:text-green-300">📊 Quản lý kho</Link>
            </div>
          )}
        </div>
        {/* quan ly danh muc */}
       <div>
          <div
            onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
            className="flex items-center justify-between gap-2 cursor-pointer hover:text-green-400"
          >
            <div className="flex items-center gap-2">
              <TbCategoryFilled size={20} /> Quản lý Danh mục
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {categoryMenuOpen && (
               <div className="ml-6 mt-2 space-y-2 text-sm">
              <Link to="/admin/categories" className="block hover:text-green-300">📦 Tất cả danh mục - Thêm - Sửa - Xóa</Link>            </div>
          )}
        </div>
        {/* quan ly don hang */}
      <div>
          <div
            onClick={() => setOrderMenuOpen(!OrderMenuOpen)}
            className="flex items-center justify-between gap-2 cursor-pointer hover:text-green-400"
          >
            <div className="flex items-center gap-2">
              <ListOrdered size={20} /> Quản lý Đơn hàng
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${OrderMenuOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {OrderMenuOpen && (
            <div className="ml-6 mt-2 space-y-2 text-sm">
              <Link to="/admin/orders" className="block hover:text-green-300">📦 Tất cả đơn hàng</Link>
            </div>
          )}
        </div>
        {/* quản lý banner */}
      <div>
          <div
            onClick={() => setBannerMenuOpen(!bannerMenuOpen)}
            className="flex items-center justify-between gap-2 cursor-pointer hover:text-green-400"
          >
            <div className="flex items-center gap-2">
              <ImageIcon size={20} /> Quản lý Banner  
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${bannerMenuOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {bannerMenuOpen && (
            <div className="ml-6 mt-2 space-y-2 text-sm">
              <Link to="/admin/banners/add" className="block hover:text-green-300">📦Thêm, Sửa, Xóa Banner</Link>
              <Link to="/admin/banners/dashboard" className="block hover:text-green-300">➕ Thống kê Banner</Link>
            </div>
          )}
        </div>
        {/* quản lý bài viết */}
      <div>
          <div
            onClick={() => setPostMenuOpen(!postMenuOpen)}
            className="flex items-center justify-between gap-2 cursor-pointer hover:text-green-400"
            >
            <div className="flex items-center gap-2">
              <LucidePodcast size={20} /> Quản lý Bài Viết
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${postMenuOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {postMenuOpen && (
            <div className="ml-6 mt-2 space-y-2 text-sm">
              <Link to="/admin/posts" className="block hover:text-green-300">📦 Danh sách bài viết</Link>
            </div>
          )}
        </div>
        {/* Khách hàng */}
        <div>
          <div
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center justify-between gap-2 cursor-pointer hover:text-green-400"
          >
            <div className="flex items-center gap-2">
              <TbCategoryFilled size={20} /> Quản lý Người Dùng
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {userMenuOpen && (
            <div className="ml-6 mt-2 space-y-2 text-sm">
              <Link to="/admin/products" className="block hover:text-green-300">📦 Danh sách người dung</Link>
              <Link to="/admin/products/add" className="block hover:text-green-300">➕ Xem chi tiết</Link>
              <Link to="/admin/products/add" className="block hover:text-green-300">➕ Khóa/mở tài khoản </Link>              

            </div>
          )}
        </div>
          {/* thống kê */}
        <Link to="/admin/users" className="flex items-center gap-2 hover:text-green-400">
           <ChartAreaIcon size={20} /> Thống kê & Báo cáo
        </Link>
          {/* phân quyền và bảo mật */}
        <div>
          <div
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center justify-between gap-2 cursor-pointer hover:text-green-400"
          >
            <div className="flex items-center gap-2">
              <FaProductHunt size={20} />Phân quyền & Bảo mật
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${roleMenuOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {roleMenuOpen && (
            <div className="ml-6 mt-2 space-y-2 text-sm">
              <Link to="/admin/staffs" className="block hover:text-green-300">📦 Tất cả Staff</Link>
              <Link to="/admin/register" className="block hover:text-green-300">📦 Tạo tài khoản Staff</Link>
              <Link to="/admin/activity-logs" className="block hover:text-green-300">➕ Theo dõi lịch sử hành động</Link>
            </div>
          )}
        </div>
        {/* quản lý liên hệ */}
          <Link to="/admin/contact" className="flex items-center gap-2 hover:text-green-400">
          <PhoneCall size={20} />Quản lý Liên Hệ
        </Link>
        {/* cài đặt hệ thống */}
           <div>
          <div
            onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
            className="flex items-center justify-between gap-2 cursor-pointer hover:text-green-400"
          >
            <div className="flex items-center gap-2">
              <Settings size={20} />Cài Đặt Hệ thống
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${settingsMenuOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {settingsMenuOpen && (
            <div className="ml-6 mt-2 space-y-2 text-sm">
              <Link to="/admin/qr" className="block hover:text-green-300">➕ Cấu hình thanh toán, vận chuyển</Link>

            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
