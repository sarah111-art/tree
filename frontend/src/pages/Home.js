import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useShop } from '../context/ShopContext';
import axios from '../api';
import { backendUrl } from '../context/ShopContext';
import { motion } from 'framer-motion';
import Slider from '../components/Slider';
import CategorySlider from '../components/CategorySlider';
import ProductCard from '../components/ProductCard';
import ProductList from '../components/ProductList';
import SectionBlock from '../components/SectionBlock';
import QuickView from '../components/QuickView';
import { HeartHandshake, Phone, Truck } from 'lucide-react';

export default function Home() {
  const { category } = useParams();
  const { products } = useShop();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [newest, setNewest] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [posts, setPosts] = useState([]);
  const normalize = (str) => str.toLowerCase().replace(/\s+/g, '-');

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
  return (
    <div>
      <div>
        <Helmet>
          <title>
            {category ? `Danh mục: ${category.replace('-', ' ')}` : 'Bonsai Việt - Trang chủ'}
          </title>
        </Helmet>
          <div className="bg-green-50 py-3 border-t border-b border-green-200">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm sm:text-base">
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 mb-1" />
                <p className="text-green-800 font-semibold">Tư vấn tận tâm</p>
                <p className="text-gray-500 text-xs">Hỗ trợ chọn cây phù hợp</p>
              </div>
              <div className="flex flex-col items-center">
                <Truck alt="Giao nhanh" className="w-8 h-8 mb-1" />
                <p className="text-green-800 font-semibold">Giao hàng nhanh</p>
                <p className="text-gray-500 text-xs">Toàn quốc trong 2-3 ngày</p>
              </div>
              <div className="flex flex-col items-center">
                <HeartHandshake className="w-8 h-8 mb-1" />
                <p className="text-green-800 font-semibold">Hỗ trợ trọn đời</p>
                <p className="text-gray-500 text-xs">Tư vấn chăm cây miễn phí</p>
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
