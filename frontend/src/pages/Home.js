import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useShop } from '../context/ShopContext';
import axios from 'axios';
import { backendUrl } from '../context/ShopContext';
import { motion } from 'framer-motion';
import Slider from '../components/Slider';
import CategorySlider from '../components/CategorySlider';
import ProductCard from '../components/ProductCard';
import ProductList from '../components/ProductList';
import SectionBlock from '../components/SectionBlock';
import QuickView from '../components/QuickView';
import { HeartHandshake, Phone, Truck, User, ShoppingCart, Heart } from 'lucide-react';

export default function Home() {
  const { category } = useParams();
  const { products, token, user } = useShop();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [newest, setNewest] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [posts, setPosts] = useState([]);
  const normalize = (str) => str.toLowerCase().replace(/\s+/g, '-');
  const [loading,setLoading] = useState(true);

  const filteredProducts = category
    ? products.filter((p) => normalize(p.category) === category)
    : products;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  useEffect(() => {
    const fetchSpecialProducts = async () => {
      try {
        const bestRes = await axios.get(`${backendUrl}/api/products/best-sellers?limit=3`);
        const newRes = await axios.get(`${backendUrl}/api/products/newest?limit=3`);
        const topRes = await axios.get(`${backendUrl}/api/products/top-rated?limit=3`);
        setBestSellers(bestRes.data);
        setNewest(newRes.data);
        setTopRated(topRes.data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Lỗi khi tải sản phẩm đặc biệt:', err.message);
      }
    };

    fetchSpecialProducts();
  }, []);

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };
//bai post
  useEffect(() => {
    axios.get(`${backendUrl}/api/posts`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error('❌ Lỗi khi tải bài viết:', err.message));
      
  }, []);

  if(loading){
    return <div className='flex items-center justify-center min-h-screen'><img src="/loading.gif" alt="Loading..." className='w-16 h-16 animate-spin' /></div>
  }
  return (
    <div>
      <div>
        <Helmet>
          <title>
            {category ? `Danh mục: ${category.replace('-', ' ')}` : 'Bonsai Việt - Trang chủ'}
          </title>
        </Helmet>
          <div className="bg-gradient-to-r from-green-50 via-green-100 to-green-50 py-8 border-t border-b border-green-200">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="group">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-green-800 font-bold text-lg mb-2">Tư vấn tận tâm</h3>
                    <p className="text-gray-600 text-sm">Hỗ trợ chọn cây phù hợp với không gian phong thủy</p>
                  </div>
                </div>
                
                <div className="group">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Truck className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-green-800 font-bold text-lg mb-2">Giao hàng nhanh</h3>
                    <p className="text-gray-600 text-sm">Toàn quốc trong 2-3 ngày với đóng gói cẩn thận</p>
                  </div>
                </div>
                
                <div className="group">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <HeartHandshake className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-green-800 font-bold text-lg mb-2">Hỗ trợ trọn đời</h3>
                    <p className="text-gray-600 text-sm">Tư vấn chăm cây miễn phí và bảo hành chất lượng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {!category ? (
          <>
            <div className="overflow-hidden w-full pt-4">
              <motion.h1
                className="text-5xl sm:text-3xl font-bold mb-6 text-green-800 whitespace-nowrap"
                animate={{ x: ['100%', '-100%'] }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: 'linear',
                }}
              >
                🌿 Bonsai Việt - Cây kiểng nghệ thuật 🌱
              </motion.h1>
            </div>
            <Slider />
            <CategorySlider />
            <h2 className="text-2xl font-bold mt-10 mb-4">📦 Tất cả sản phẩm</h2>
            <ProductList onQuickView={handleQuickView} />
            <SectionBlock title="🔥 Bán chạy nhất" products={bestSellers} onQuickView={handleQuickView} />
            <SectionBlock title="🆕 Sản phẩm mới" products={newest} onQuickView={handleQuickView} />
            <SectionBlock title="⭐ Top xếp hạng" products={topRated} onQuickView={handleQuickView} />
            
            {/* Section Tài khoản của tôi - chỉ hiển thị khi đã đăng nhập */}
            {token && (
              <div className="mt-12">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">👤 Tài khoản của tôi</h2>
                    <p className="text-gray-600">Xin chào, {user?.name || user?.phone}!</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link 
                      to="/yeu-thich"
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100 group"
                    >
                      <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                        <Heart className="w-6 h-6 text-pink-600" />
                      </div>
                      <h3 className="text-center font-semibold text-gray-800 mb-2">Sản phẩm yêu thích</h3>
                      <p className="text-center text-sm text-gray-600">Xem danh sách sản phẩm đã yêu thích</p>
                    </Link>
                    
                    <Link 
                      to="/gio-hang"
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100 group"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                        <ShoppingCart className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-center font-semibold text-gray-800 mb-2">Giỏ hàng</h3>
                      <p className="text-center text-sm text-gray-600">Xem và quản lý giỏ hàng của bạn</p>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <img
              src={`/images/categories/${category}.jpg`}
              alt={category}
              className="w-full h-52 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold mt-6 capitalize mb-2">
              Danh mục: {category.replace('-', ' ')}
            </h2>

            {filteredProducts.length === 0 ? (
              <p className="text-gray-500">Không có sản phẩm nào.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ✅ Hiển thị QuickView nếu có sản phẩm được chọn */}
        {quickViewProduct && (
          <QuickView
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </div>

{posts.slice(0, 2).map((post, index) => (
  <motion.div
    key={post._id}
    className="group flex flex-col md:flex-row border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden bg-white"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay: index * 0.2 }}
  >
    {/* Ảnh */}
    <div className="w-full md:w-1/3 h-56 md:h-auto overflow-hidden">
      <img
        src={post.image || '/placeholder.jpg'}
        alt={post.title}
        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />
    </div>

    {/* Nội dung */}
    <div className="p-4 flex flex-col justify-between w-full md:w-2/3">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-700 transition">
          {post.title}
        </h3>
        <p
          className="text-sm text-gray-600 leading-relaxed line-clamp-3"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
      <div className="mt-4">
        <a
          href={`/bai-viet/${post._id}`}
          className="text-green-600 text-sm font-medium hover:underline"
        >
          Xem chi tiết →
        </a>
      </div>
    </div>
  </motion.div>
))}


    </div>
  );
}
