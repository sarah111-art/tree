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
        <ul className="flex flex-wrap items-center justify-center gap-x-8 font-medium text-green-800 text-sm">
          <li>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 rounded-full hover:bg-green-200 hover:text-green-900 transition-all duration-200 font-semibold"
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
            return (
              <li key={parent._id} className="relative group">
                <div className="inline-flex items-center px-4 py-2 rounded-full hover:bg-green-200 hover:text-green-900 transition-all duration-200 cursor-pointer">
                  <Link to={`/danh-muc/${parent.slug}`} className="capitalize">
                    {parent.name}
                  </Link>
                  {children.length > 0 && (
                    <ChevronDown size={16} className="ml-1 text-green-600 group-hover:text-green-800 transition-colors" />
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
                            className="px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 rounded-lg capitalize transition-all duration-200"
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
