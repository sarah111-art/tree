import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useShop } from '../context/ShopContext';
import axios from 'axios';
import { backendUrl } from '../context/ShopContext';
import { motion } from 'framer-motion';
import Slider from '../components/Slider';
import ProductCard from '../components/ProductCard';
import SidebarFilter from '../components/SidebarFilter';
import QuickView from '../components/QuickView';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from 'lucide-react';
import Loading from '../components/Loading';

export default function Home() {
  const { category } = useParams();
  const { products, categories, loading, token, user } = useShop();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [priceFilter, setPriceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [discountProducts, setDiscountProducts] = useState([]);
  const productsPerPage = 12;
  const normalize = (str) => str.toLowerCase().replace(/\s+/g, '-');

  const filteredProducts = category
    ? products.filter((p) => normalize(p.category) === category)
    : products;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  // Lọc và sắp xếp sản phẩm
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products].filter(p => p.status === 'active');

    // Lọc theo giá
    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number);
      filtered = filtered.filter(p => {
        const price = p.salePrice > 0 ? p.salePrice : p.price;
        return price >= min && (max ? price <= max : true);
      });
    }

    // Lọc theo danh mục
    if (categoryFilter) {
      filtered = filtered.filter(p => 
        p.category === categoryFilter || p.category?._id === categoryFilter
      );
    }

    // Sắp xếp
    if (sortOption === 'price-asc') {
      filtered.sort((a, b) => {
        const priceA = a.salePrice > 0 ? a.salePrice : a.price;
        const priceB = b.salePrice > 0 ? b.salePrice : b.price;
        return priceA - priceB;
      });
    } else if (sortOption === 'price-desc') {
      filtered.sort((a, b) => {
        const priceA = a.salePrice > 0 ? a.salePrice : a.price;
        const priceB = b.salePrice > 0 ? b.salePrice : b.price;
        return priceB - priceA;
      });
    } else {
      // Mới nhất (theo createdAt)
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return filtered;
  }, [products, priceFilter, categoryFilter, sortOption]);

  // Reset trang khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [priceFilter, categoryFilter, sortOption]);

  // Lấy sản phẩm giảm giá cho sidebar
  useEffect(() => {
    const discount = products.filter(p => p.salePrice > 0 && p.status === 'active').slice(0, 1);
    setDiscountProducts(discount);
  }, [products]);


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
    return <Loading />
  }
  return (
    <div>
      <div>
        <Helmet>
          <title>
            {category ? `Danh mục: ${category.replace('-', ' ')}` : 'Còi Garden - Trang chủ'}
          </title>
        </Helmet>
          {/* <div className="bg-gradient-to-r from-green-50 via-green-100 to-green-50 py-8 border-t border-b border-green-200">
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
          </div> */}
        {!category ? (
          <>
            <div className="overflow-hidden w-full">
              <motion.h1
                className="text-6xl md:text-5xl sm:text-3xl font-extrabold font-serif tracking-tight leading-tight text-green-800 whitespace-nowrap"
                animate={{ x: ['100%', '-100%'] }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: 'linear',
                }}
              >
                Còi Garden - Mang Hơi Thở Xanh Vào Ngôi Nhà Bạn
              </motion.h1>
            </div>
            <Slider />
            
            {/* Product listing với sidebar */}
            <div className="flex gap-6 mt-10">
              {/* Sidebar */}
              <SidebarFilter
                categories={categories}
                onPriceFilter={setPriceFilter}
                onCategoryFilter={setCategoryFilter}
                discountProducts={discountProducts}
              />

              {/* Main content */}
              <div className="flex-1">
                {/* Sorting options */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setSortOption('newest')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      sortOption === 'newest'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Mới nhất
                  </button>
                  <button
                    onClick={() => setSortOption('price-asc')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      sortOption === 'price-asc'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Giá tăng dần
                  </button>
                  <button
                    onClick={() => setSortOption('price-desc')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      sortOption === 'price-desc'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Giá giảm dần
                  </button>
                </div>

                {/* Product grid */}
                {filteredAndSortedProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Không có sản phẩm nào.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {filteredAndSortedProducts
                      .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                      .map((product) => (
                        <ProductCard key={product._id} product={product} onQuickView={handleQuickView} />
                      ))}
                  </div>
                )}

                {/* Pagination */}
                {filteredAndSortedProducts.length > 0 && (() => {
                  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
                  if (totalPages <= 1) return null;
                  
                  const getPageNumbers = () => {
                    const pages = [];
                    const showEllipsis = totalPages > 7;
                    
                    if (!showEllipsis) {
                      // Hiển thị tất cả các trang nếu ít hơn 7 trang
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // Luôn hiển thị trang đầu
                      pages.push(1);
                      
                      if (currentPage > 3) {
                        pages.push('ellipsis-start');
                      }
                      
                      // Hiển thị các trang xung quanh trang hiện tại
                      const start = Math.max(2, currentPage - 1);
                      const end = Math.min(totalPages - 1, currentPage + 1);
                      
                      for (let i = start; i <= end; i++) {
                        if (i !== 1 && i !== totalPages) {
                          pages.push(i);
                        }
                      }
                      
                      if (currentPage < totalPages - 2) {
                        pages.push('ellipsis-end');
                      }
                      
                      // Luôn hiển thị trang cuối
                      pages.push(totalPages);
                    }
                    
                    return pages;
                  };
                  
                  const pageNumbers = getPageNumbers();
                  
                  return (
                    <div className="flex items-center justify-center gap-2 mt-8 mb-8">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                        title="Trang trước"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      {pageNumbers.map((page, index) => {
                        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                          return (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                              ...
                            </span>
                          );
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-green-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage >= totalPages}
                        className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                        title="Trang sau"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
            
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
