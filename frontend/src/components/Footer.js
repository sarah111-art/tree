import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import { useShop } from '../context/ShopContext';
import axios from 'axios';
import { backendUrl } from '../context/ShopContext';
import footerBg from '../assets/banner/banner1.jpg'; // Fallback image

export default function Footer() {
  const { token } = useShop();
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooter = async () => {
      // Kiểm tra backendUrl
      if (!backendUrl) {
        console.error('❌ BackendUrl is not defined!', backendUrl);
        setLoading(false);
        return;
      }
      
      try {
        const apiUrl = `${backendUrl}/api/footers/active`;
        console.log('🔄 Fetching footer from:', apiUrl);
        console.log('🔄 BackendUrl:', backendUrl);
        
        const res = await axios.get(apiUrl, {
          timeout: 10000, // 10 seconds timeout
        });
        
        console.log('✅ Footer API response:', res.data);
        console.log('📊 Response status:', res.status);
        console.log('📊 Full response:', res);
        
        if (res.data && res.data._id) {
          console.log('✅ Footer data loaded successfully!');
          console.log('📦 Footer data:', JSON.stringify(res.data, null, 2));
          setFooterData(res.data);
          setLoading(false);
        } else if (res.data === null) {
          console.warn('⚠️ API trả về null - không có footer active');
          console.warn('💡 Hãy kiểm tra trong admin panel xem có footer nào với status "active" không');
          setFooterData(null);
          setLoading(false);
        } else {
          console.warn('⚠️ Dữ liệu footer không hợp lệ:', res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Lỗi khi tải footer:', err);
        if (err.response) {
          console.error('❌ Error response data:', err.response.data);
          console.error('❌ Error status:', err.response.status);
          console.error('❌ Error headers:', err.response.headers);
        } else if (err.request) {
          console.error('❌ No response received:', err.request);
          console.error('💡 Có thể backend không chạy hoặc không thể kết nối');
        } else {
          console.error('❌ Error message:', err.message);
        }
        setLoading(false);
      }
    };
    
    fetchFooter();
    
    // Refresh footer mỗi 10 giây để cập nhật dữ liệu mới (giảm từ 30s để test nhanh hơn)
    const interval = setInterval(fetchFooter, 10000);
    return () => clearInterval(interval);
  }, []);

  // Sử dụng dữ liệu từ API nếu có, chỉ dùng fallback khi không có footerData
  const companyInfo = footerData?.companyInfo || {
    title: 'Còi Garden',
    description: 'Cây Cảnh Việt chuyên cung cấp cây kiểng, cây hoa, cây công trình, Terrarium... với số lượng sỉ & lẻ toàn quốc. Đa dạng chủng loại và giá hợp lý để làm hài lòng quý khách hàng.'
  };

  const menuLinks = footerData?.menuLinks || [];

  const supportInfo = footerData?.supportInfo || {
    openingHours: '8h00 - 20h00',
    hotline: '0977 48 1919',
    salesPhone: '0907 48 1919',
    feedbackPhone: '0923 177779',
    email: 'info@coigarden.com'
  };

  const socialLinks = footerData?.socialLinks || {};

  const copyright = footerData?.copyright || {
    text: 'Bản quyền thuộc',
    year: '2015–2024',
    website: 'coigarden.vn'
  };

  // Ưu tiên backgroundImage từ API, nếu không có thì dùng fallback
  const backgroundImage = footerData?.backgroundImage || footerBg;
  
  // Debug log để kiểm tra dữ liệu đang được sử dụng
  useEffect(() => {
    if (footerData && footerData._id) {
      console.log('✅ Đang sử dụng footer data từ API:', footerData);
      console.log('📝 Company Info:', companyInfo);
      console.log('📞 Support Info:', supportInfo);
      console.log('©️ Copyright:', copyright);
      console.log('🖼️ Background Image:', backgroundImage);
      console.log('🔗 Menu Links:', menuLinks);
      console.log('📱 Social Links:', socialLinks);
    } else {
      console.log('⚠️ Chưa có footer data từ API, đang sử dụng fallback data');
      console.log('💡 Hãy kiểm tra:', {
        footerData,
        backendUrl,
        loading
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [footerData]);

  return (
    <footer
      className="relative text-white text-sm bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})`, zIndex: 10 }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Cột 1: Thông tin công ty */}
        <div>
          <h2 className="text-white-400 font-bold text-lg mb-2">{companyInfo.title}</h2>
          <p className="text-gray-300">
            {companyInfo.description}
          </p>

          {/* Mạng xã hội */}
          <div className="flex items-center space-x-3 mt-4">
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaFacebookF />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaInstagram />
              </a>
            )}
            {socialLinks.zalo && (
              <a href={socialLinks.zalo} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <SiZalo />
              </a>
            )}
            {socialLinks.youtube && (
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaYoutube />
              </a>
            )}
          </div>
        </div>

        {/* Cột 2: Menu Links */}
        {menuLinks.length > 0 && (
          <div>
            <h3 className="text-white-400 font-semibold text-md mb-2">Liên kết</h3>
            <ul className="space-y-1 text-gray-300">
              {menuLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.url} className="hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cột 3: Trống hoặc có thể thêm nội dung khác */}
        <div></div>

        {/* Cột 4: Hỗ trợ */}
        <div>
          <h3 className="text-white-400 font-semibold text-md mb-2">Hỗ trợ khách hàng</h3>
          <ul className="space-y-1 text-gray-300">
            {supportInfo.openingHours && (
              <li><b>Mở cửa:</b> {supportInfo.openingHours}</li>
            )}
            {supportInfo.hotline && (
              <li><b>Hotline:</b> {supportInfo.hotline}</li>
            )}
            {supportInfo.salesPhone && (
              <li><b>Bán hàng:</b> {supportInfo.salesPhone}</li>
            )}
            {supportInfo.feedbackPhone && (
              <li><b>Phản hồi:</b> {supportInfo.feedbackPhone}</li>
            )}
            {supportInfo.email && (
              <li><b>Email:</b> <a href={`mailto:${supportInfo.email}`} className="underline">{supportInfo.email}</a></li>
            )}
          </ul>
          
          {/* Tài khoản - chỉ hiển thị khi đã đăng nhập */}
          {token && (
            <>
              <h3 className="text-white-400 font-semibold text-md mb-2 mt-4">Tài khoản</h3>
              <ul className="space-y-1 text-gray-300">
                <li><Link to="/yeu-thich" className="hover:text-white transition-colors">💖 Sản phẩm yêu thích</Link></li>
                <li><Link to="/gio-hang" className="hover:text-white transition-colors">🛒 Giỏ hàng</Link></li>
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Line cuối */}
      <div className="relative bg-black/70 text-center text-gray-300 py-3 text-xs">
        {copyright.text} {copyright.website && <span className="text-green-500 font-semibold">{copyright.website}</span>} © {copyright.year}
      </div>
    </footer>
  );
}
