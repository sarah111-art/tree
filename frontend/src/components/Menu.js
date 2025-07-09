import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ChevronDown } from "lucide-react"; // icon mũi tên v

export default function Menu() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("❌ Lỗi khi load danh mục:", err));
  }, []);

  const parentCategories = categories.filter(cat => !cat.parent);
  const getChildren = (parentId) =>
    categories.filter(cat => cat.parent === parentId);

  return (
    <nav className="bg-white shadow border-b border-gray-200 z-50 relative">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <ul className="flex flex-wrap justify-center gap-x-6 font-medium text-gray-700 text-sm">
          <li><Link to="/" className="hover:text-green-700">Trang chủ</Link></li>
          <li><Link to="/gioi-thieu" className="hover:text-green-700">Giới thiệu</Link></li>

          {/* Danh mục cha/con */}
          {parentCategories.map((parent) => {
            const children = getChildren(parent._id);
            return (
              <li key={parent._id} className="relative group">
                <div className="flex items-center gap-1 hover:text-green-700 capitalize cursor-pointer">
                  <Link to={`/danh-muc/${parent.slug}`}>
                    {parent.name}
                  </Link>
                  {children.length > 0 && (
                    <ChevronDown size={14} className="mt-[1px]" />
                  )}
                </div>

                {/* Dropdown con */}
                {children.length > 0 && (
                  <ul className="absolute left-0 top-full mt-2 w-44 bg-white border rounded-md shadow-md z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                    {children.map(child => (
                      <li key={child._id}>
                        <Link
                          to={`/danh-muc/${child.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-100 capitalize"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}

          <li><Link to="/cam-nang" className="hover:text-green-700">Cẩm nang</Link></li>
          <li><Link to="/lien-he" className="hover:text-green-700">Liên hệ</Link></li>
        </ul>
      </div>
    </nav>
  );
}
