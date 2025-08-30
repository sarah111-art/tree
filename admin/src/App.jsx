import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { LoadingProvider } from './context/LoadingContext';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './page/Login';

import Dashboard from './page/Dashboard';
import Add from './page/Add';
import Profile from './components/Profile';
import RegisterStaff from './page/Staff/RegisterStaff';
import StaffList from './page/Staff/StaffList';
import CategoryList from './page/Category/CategoryList';
import ProductList from './page/Product/ProductList';
import AddProduct from './page/Product/AddProduct';
import EditProduct from './page/Product/EditProduct';
import Warehouse from './page/Product/Warehouse';
import AdminOrderList from './page/Order/AdminOrderList';
import AdminBannerList from './page/Banner/AddBanner';
import BannerDashboard from './page/Banner/BannerDashboard';
import AddBanner from './page/Banner/AddBanner';
import PostList from './page/Post/PostList';
import ActivityLog from './page/Staff/ActivityLog';
import ContactList from './page/Contact/ContactList';
import QRManager from './page/Payment/QRManager';
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '$';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Nếu đang ở trang login → chỉ hiển thị Login page
  if (location.pathname === '/admin/login') {
    return (
      <>
        <ToastContainer />
        <Login setToken={setToken} />
      </>
    );
  }

  // Nếu chưa đăng nhập → redirect về login
  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <LoadingProvider>
      <main className="bg-primary text-[#404040] min-h-screen flex">
        <ToastContainer />

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(false)}
          token={token}
          setToken={setToken}
        />

        {/* Main content */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out 
          ${sidebarOpen ? 'ml-0' : 'ml-0'} md:ml-64`}
        >
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white shadow">
            <Header onOpenSidebar={() => setSidebarOpen(true)} />
          </div>

          {/* Routes */}
          <div>
            <Routes>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/products/add" element={<AddProduct />} />
              <Route path="/admin/products/edit/:id" element={<EditProduct />} />
              <Route path="/admin/products/stock" element={<Warehouse />} />
              <Route path="/admin/orders" element={<AdminOrderList />} />
              <Route path="/admin/profile" element={<Profile />} />
              <Route path="/admin/register" element={<RegisterStaff />} />
              <Route path="/admin/staffs" element={<StaffList />} />
              <Route path="/admin/categories" element={<CategoryList />} />
              <Route path="/admin/categories/add" element={<Add />} />
              <Route path="/admin/banners/add" element={<AddBanner />} />
              <Route path="/admin/banners/dashboard" element={<BannerDashboard />} />
              <Route path="/admin/posts" element={<PostList />} />
              <Route path="/admin/activity-logs" element={<ActivityLog />} />
              <Route path="/admin/contact" element={<ContactList />} />
              <Route path="/admin/qr" element={<QRManager />} />
            </Routes>
          </div>
        </div>
      </main>
    </LoadingProvider>
  );
}

export default App;
