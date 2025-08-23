import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { backendUrl, useShop } from "../context/ShopContext";

export default function Menu() {
  const { token } = useShop();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${backendUrl}/api/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error("❌ Lỗi khi load danh mục:", err));
  }, []);

  const parentCategories = categories.filter(cat => !cat.parent);
  const getChildren = (parentId) =>
    categories.filter(cat => cat.parent === parentId);

  return (
    <nav className="bg-gradient-to-r from-green-50 to-green-100 shadow-lg border-b border-green-200 relative z-40">
      <div className="container mx-auto px-4 py-4">
        <ul className="flex flex-wrap justify-center gap-x-8 font-medium text-green-800 text-sm">
          <li>
            <Link 
              to="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-green-200 hover:text-green-900 transition-all duration-200 font-semibold"
            >
              <span className="text-lg">🏠</span>
              Trang chủ
            </Link>
          </li>
          
          <li>
            <Link 
              to="/gioi-thieu" 
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-green-200 hover:text-green-900 transition-all duration-200"
            >
              <span className="text-lg">ℹ️</span>
              Giới thiệu
            </Link>
          </li>

          {/* Danh mục cha/con */}
          {parentCategories.map((parent) => {
            const children = getChildren(parent._id);
            return (
              <li key={parent._id} className="relative group">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-green-200 hover:text-green-900 transition-all duration-200 cursor-pointer">
                  <Link to={`/danh-muc/${parent.slug}`} className="flex items-center gap-2">
                    <span className="text-lg">
                      {parent.name.includes('Hoa') ? '🌸' : 
                       parent.name.includes('Bosai') ? '🌿' :
                       parent.name.includes('Vật Tư') ? '🛠️' :
                       parent.name.includes('Để Bàn') ? '🖼️' :
                       parent.name.includes('Tết') ? '🎊' :
                       parent.name.includes('Ăn Quả') ? '🍎' : '🌱'}
                    </span>
                    <span className="capitalize">{parent.name}</span>
                  </Link>
                  {children.length > 0 && (
                    <ChevronDown size={16} className="text-green-600 group-hover:text-green-800 transition-colors" />
                  )}
                </div>

                {/* Dropdown con */}
                {children.length > 0 && (
                  <ul className="absolute left-0 top-full mt-2 w-56 bg-white border border-green-200 rounded-xl shadow-xl z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
                    <div className="p-2">
                      {children.map(child => (
                        <li key={child._id}>
                          <Link
                            to={`/danh-muc/${child.slug}`}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 rounded-lg capitalize transition-all duration-200 group/item"
                          >
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover/item:bg-green-200 transition-colors">
                              <span className="text-green-600 text-xs">
                                {child.name.includes('Hồng') ? '🌹' :
                                 child.name.includes('Vạn Thọ') ? '🌼' :
                                 child.name.includes('Lưỡi Hổ') ? '🌵' :
                                 child.name.includes('Nguyệt Quế') ? '🌺' : '🌿'}
                              </span>
                            </div>
                            <span className="font-medium">{child.name}</span>
                          </Link>
                        </li>
                      ))}
                    </div>
                  </ul>
                )}
              </li>
            );
          })}

          <li>
            <Link 
              to="/cam-nang" 
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-green-200 hover:text-green-900 transition-all duration-200"
            >
              <span className="text-lg">📚</span>
              Cẩm nang
            </Link>
          </li>
          
          <li>
            <Link 
              to="/lien-he" 
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-green-200 hover:text-green-900 transition-all duration-200"
            >
              <span className="text-lg">📞</span>
              Liên hệ
            </Link>
          </li>
          
          {/* Đơn hàng - chỉ hiển thị khi đã đăng nhập */}
          {token && (
            <li>
              <Link 
                to="/don-hang" 
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-green-200 hover:text-green-900 transition-all duration-200"
              >
                <span className="text-lg">📋</span>
                Đơn hàng
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
