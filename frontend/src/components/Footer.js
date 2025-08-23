import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaPhoneAlt } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import { useShop } from '../context/ShopContext';

export default function Footer() {
  const { token } = useShop();
  
  return (
    <footer className="bg-green-700 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8"
      
      >
        {/* Cột 1: Thông tin công ty */}
        <div>
          <h2 className="text-white-400 font-bold text-lg mb-2">Bonsai</h2>
          <p className="text-gray-300">
            Cây Cảnh Việt chuyên cung cấp cây kiểng, cây hoa, cây công trình, Bonsai... với số lượng sỉ & lẻ toàn quốc. Đa dạng chủng loại và giá hợp lý để làm hài lòng quý khách hàng.
          </p>

          {/* Mạng xã hội */}
          <div className="flex items-center space-x-3 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaInstagram />
            </a>
            <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <SiZalo />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Cột 2: Menu */}
        <div>
          <h3 className="text-white-400 font-semibold text-md mb-2">Menu</h3>
          <ul className="space-y-1 text-gray-300">
            <li><Link to='/'>Trang chủ</Link></li>
            <li><Link to='/gioi-thieu'>Giới thiệu</Link></li>
            <li><Link to='/san-pham'>Sản phẩm</Link></li>
            <li><Link to='/cam-nang'>Cẩm nang</Link></li>
            <li><Link to='/lien-he'>Liên hệ</Link></li>
          </ul>
        </div>

        {/* Cột 3: Hướng dẫn */}
        <div>
          <h3 className="text-white-400 font-semibold text-md mb-2">Hướng dẫn</h3>
          <ul className="space-y-1 text-gray-300">
            <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
            <li><Link to="/chinh-sach-bao-hanh">Chính sách bảo hành</Link></li>
            <li><Link to="/phuong-thuc-thanh-toan">Phương thức thanh toán</Link></li>
            <li><Link to="/phuong-thuc-van-chuyen">Phương thức vận chuyển</Link></li>
            <li><Link to="/cam-ket-chat-luong">Cam kết chất lượng</Link></li>
          </ul>
        </div>

        {/* Cột 4: Hỗ trợ */}
        <div>
          <h3 className="text-white-400 font-semibold text-md mb-2">Hỗ trợ khách hàng</h3>
          <ul className="space-y-1 text-gray-300">
            <li><b>Mở cửa:</b> 8h00 - 20h00</li>
            <li><b>Hotline:</b> 0977 48 1919</li>
            <li><b>Bán hàng:</b> 0907 48 1919</li>
            <li><b>Phản hồi:</b> 0923 177779</li>
            <li><b>Email:</b> <a href="mailto:info.caybonsai@gmail.com" className="underline">info.caybonsai@gmail.com</a></li>
          </ul>
          
          {/* Tài khoản - chỉ hiển thị khi đã đăng nhập */}
          {token && (
            <>
              <h3 className="text-white-400 font-semibold text-md mb-2 mt-4">Tài khoản</h3>
              <ul className="space-y-1 text-gray-300">
                <li><Link to="/don-hang" className="hover:text-white transition-colors">📋 Đơn hàng của tôi</Link></li>
                <li><Link to="/yeu-thich" className="hover:text-white transition-colors">💖 Sản phẩm yêu thích</Link></li>
                <li><Link to="/gio-hang" className="hover:text-white transition-colors">🛒 Giỏ hàng</Link></li>
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Line cuối */}
      <div className="bg-gray-900 text-center text-gray-400 py-3 text-xs">
        Bản quyền thuộc <span className="text-green-500 font-semibold">caybonsai.vn</span> © 2015–2024
      </div>
    </footer>
  );
}
