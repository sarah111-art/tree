import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { backendUrl } from '../../App';
import PageWrapper from '../../components/PageWrapper';
import { TableLoading } from '../../components/Loading';
import ButtonLoading from '../../components/ButtonLoading';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/products`);
      setProducts(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi load sản phẩm:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) {
      try {
        setDeletingId(id);
        await axios.delete(`${backendUrl}/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("❌ Xoá thất bại:", err.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <PageWrapper>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🛒 Danh sách sản phẩm</h2>
        <Link to="/admin/products/add" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm">
          ➕ Thêm sản phẩm
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex-1">
        {loading ? (
          <TableLoading />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
                     <thead className="bg-gray-50 text-left">
             <tr>
               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Ảnh</th>
               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Tên</th>
               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Danh mục</th>
               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Giá</th>
               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">SEO</th>
               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Hành động</th>
             </tr>
           </thead>
          <tbody>
                         {products.map(product => (
               <tr key={product._id} className="hover:bg-gray-100 border-b border-gray-100">
                 <td className="px-4 py-3">
                   {product.images && product.images.length > 0 ? (
                     <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                   ) : (
                     <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                       <span className="text-gray-400 text-xs">No img</span>
                     </div>
                   )}
                 </td>
                 <td className="px-4 py-3">
                   <div className="text-sm font-medium text-gray-900">{product.name}</div>
                 </td>
                 <td className="px-4 py-3">
                   <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                     {product.category?.name || "N/A"}
                   </span>
                 </td>
                 <td className="px-4 py-3">
                   <div className="text-sm font-semibold text-green-600">{product.price?.toLocaleString()}₫</div>
                 </td>
                 <td className="px-4 py-3">
                   <div className="text-xs text-gray-500">
                     <div><span className="font-medium">Meta:</span> {product.metaTitle || '---'}</div>
                     <div><span className="font-medium">Keywords:</span> {product.metaKeywords?.join(', ') || '---'}</div>
                   </div>
                 </td>
                 <td className="px-4 py-3">
                   <div className="flex space-x-2">
                     <Link to={`/admin/products/edit/${product._id}`} className="text-indigo-600 hover:text-indigo-900 text-sm">
                       ✏️ Sửa
                     </Link>
                     <ButtonLoading
                       loading={deletingId === product._id}
                       onClick={() => handleDelete(product._id)}
                       className="text-red-600 hover:text-red-900 text-sm bg-transparent border-none p-0"
                       size="sm"
                     >
                       🗑️ Xoá
                     </ButtonLoading>
                   </div>
                 </td>
               </tr>
             ))}
                         {products.length === 0 && (
               <tr>
                 <td colSpan="6" className="px-6 py-12">
                   <div className="text-center">
                     <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                       <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                       </svg>
                     </div>
                     <h3 className="text-sm font-medium text-gray-900 mb-2">Không có sản phẩm nào</h3>
                     <p className="text-sm text-gray-500 mb-6">Hãy bắt đầu bằng cách thêm sản phẩm đầu tiên</p>
                     <Link 
                       to="/admin/products/add" 
                       className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                     >
                       ➕ Thêm sản phẩm đầu tiên
                     </Link>
                   </div>
                 </td>
               </tr>
             )}
          </tbody>
        </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ProductList;
