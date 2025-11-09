import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ShopProvider } from './context/ShopContext';
import Header from './components/Header';
import Menu from './components/Menu';
import Footer from './components/Footer';
import Loading from './components/Loading';
import FloatingContacts from './components/FloatingContacts';
import ProductList from './components/ProductList';
import RelatedProducts from './pages/RelatedProducts';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrder';
import OrderDetail from './pages/OrderDetail';
import ContactPage from './pages/ContactPage';
import ProductListByCategory from './pages/ProductListByCategory';
import SearchResults from './components/SearchResults';
import PostDetail from './components/PostDetail';
import AllCategories from './pages/AllCategories';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Wishlist = React.lazy(() => import('./components/Wishlist'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const About = React.lazy(() => import('./pages/About'));
const Guide = React.lazy(() => import('./pages/Guide'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const Warranty = React.lazy(() => import('./pages/Warranty'));
const PaymentMethods = React.lazy(() => import('./pages/PaymentMethods'));
const ShippingMethods = React.lazy(() => import('./pages/ShippingMethods'));
const CommitmenttoQualtity = React.lazy(() => import('./pages/CommitmenttoQualtity'));

function App() {
  return (
    <ShopProvider>
      <Router>
        <Header />
        <Menu />
        <FloatingContacts />
        {/* Wrap tất cả route trong Suspense */}
        <Suspense fallback={<Loading />}>
          <main className="container mx-auto p-4 min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/danh-muc" element={<AllCategories />} />
              <Route path="/danh-muc/:slug" element={<ProductListByCategory />} />
              <Route path="/danh-muc/:parentSlug/:childSlug" element={<ProductListByCategory />} />
              <Route path="/san-pham" element={<ProductList />} />
              <Route path="/san-pham-lien-quan" element={<RelatedProducts />} />
              <Route path="/san-pham/:id" element={<ProductDetail />} />
              <Route path="/gio-hang" element={<CartPage />} />
              <Route path="/yeu-thich" element={<Wishlist />} />
              <Route path="/dang-nhap" element={<Login />} />
              <Route path="/dang-ky" element={<Register />} />
              <Route path="/dat-hang" element={<Checkout />} />
              <Route path="/don-hang" element={<MyOrders />} />
              <Route path="/don-hang/:id" element={<OrderDetail />} />
              <Route path="/tim-kiem" element={<SearchResults />} />

              {/* Các route khác */}
              <Route path="/gioi-thieu" element={<About />} />
              <Route path="/lien-he" element={<ContactPage />} />
              <Route path="/cam-nang" element={<Guide />} />
              <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy />} />
              <Route path="/chinh-sach-bao-hanh" element={<Warranty />} />
              <Route path="/phuong-thuc-thanh-toan" element={<PaymentMethods />} />
              <Route path="/phuong-thuc-van-chuyen" element={<ShippingMethods />} />
              <Route path="/cam-ket-chat-luong" element={<CommitmenttoQualtity />} />
              <Route path="/bai-viet/:id" element={<PostDetail />} />

            </Routes>
          </main>
        </Suspense>

        <Footer />
      </Router>
    </ShopProvider>
  );
}

export default App;
