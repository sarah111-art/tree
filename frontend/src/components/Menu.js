import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { backendUrl} from "../context/ShopContext";

export default function Menu() {
  //const { token } = useShop();
  const [categories, setCategories] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    axios.get(`${backendUrl}/api/categories`)
      .then(res => {
        setCategories(res.data);
        // Debug: Kiểm tra cấu trúc categories
        const parents = res.data.filter(cat => !cat.parent);
        parents.forEach(parent => {
          const children = res.data.filter(cat => {
            if (typeof cat.parent === 'object' && cat.parent?._id) {
              return cat.parent._id.toString() === parent._id.toString();
            }
            return cat.parent && cat.parent.toString() === parent._id.toString();
          });
          if (children.length > 0) {
            console.log(`📁 ${parent.name} có ${children.length} danh mục con:`, children.map(c => c.name));
          }
        });
      })
      .catch(err => console.error("❌ Lỗi khi load danh mục:", err));
  }, []);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.relative.group')) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openDropdown]);

  const parentCategories = categories.filter(cat => !cat.parent);
  const getChildren = (parentId) => {
    return categories.filter(cat => {
      // Xử lý cả trường hợp parent là object (populated) hoặc string ID
      if (typeof cat.parent === 'object' && cat.parent?._id) {
        return cat.parent._id.toString() === parentId.toString();
      }
      return cat.parent && cat.parent.toString() === parentId.toString();
    });
  };

  const toggleDropdown = (parentId) => {
    setOpenDropdown(openDropdown === parentId ? null : parentId);
  };

  return (
    <nav className="bg-gradient-to-r from-green-50 to-green-100 shadow-lg border-b border-green-200 relative z-40">
      <div className="container mx-auto px-4 py-4">
        <ul className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-8 gap-y-2 font-extrabold font-serif tracking-tight text-green-800 text-base sm:text-lg md:text-xl">
          <li>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 rounded-full hover:bg-green-200 hover:text-green-900 transition-all duration-200"
            >
              Trang chủ
            </Link>
          </li>
          
          <li>
            <Link 
              to="/gioi-thieu" 
              className="inline-flex items-center px-4 py-2 rounded-full hover:bg-green-200 hover:text-green-900 transition-all duration-200"
            >
              Giới thiệu
            </Link>
          </li>

          {/* Danh mục cha/con */}
          {parentCategories.map((parent) => {
            const children = getChildren(parent._id);
            const isOpen = openDropdown === parent._id;
            const hasChildren = children.length > 0;
            
            return (
              <li key={parent._id} className="relative group">
                <div 
                  className="inline-flex items-center px-4 py-2 rounded-full hover:bg-green-200 hover:text-green-900 transition-all duration-200 cursor-pointer"
                  onClick={(e) => {
                    if (hasChildren) {
                      e.preventDefault();
                      toggleDropdown(parent._id);
                    }
                  }}
                >
                  <Link 
                    to={`/danh-muc/${parent.slug}`} 
                    className="capitalize"
                    onClick={(e) => {
                      if (hasChildren) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {parent.name}
                  </Link>
                  {hasChildren && (
                    <ChevronDown 
                      size={18} 
                      className={`ml-2 text-green-700 group-hover:text-green-900 transition-all duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>

                {/* Dropdown con */}
                {children.length > 0 && (
                  <ul 
                    className={`absolute left-0 md:left-0 right-auto md:right-auto top-full mt-2 w-56 max-w-[calc(100vw-2rem)] bg-white border border-green-200 rounded-xl shadow-xl z-50 transition-all duration-300 transform origin-top ${
                      isOpen 
                        ? 'opacity-100 visible scale-100' 
                        : 'opacity-0 invisible scale-95 md:group-hover:opacity-100 md:group-hover:visible md:group-hover:scale-100'
                    }`}
                  >
                    <div className="p-2 max-h-[60vh] overflow-y-auto">
                      {children.map(child => (
                        <li key={child._id}>
                          <Link
                            to={`/danh-muc/${child.slug}`}
                            className="px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 rounded-lg capitalize transition-all duration-200 block"
                            onClick={() => setOpenDropdown(null)}
                          >
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
              className="inline-flex items-center px-4 py-2 rounded-full hover:bg-green-200 hover:text-green-900 transition-all duration-200"
            >
              Cẩm nang
            </Link>
          </li>
          
          <li>
            <Link 
              to="/lien-he" 
              className="inline-flex items-center px-4 py-2 rounded-full hover:bg-green-200 hover:text-green-900 transition-all duration-200"
            >
              Liên hệ
            </Link>
          </li>
          

        </ul>
      </div>
    </nav>
  );
}
