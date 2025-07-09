// src/page/Warehouse/WarehouseList.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../api';
import { backendUrl } from '../../App';
import { FiDownload } from 'react-icons/fi';

const Warehouse= () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState({ category: '', status: '', search: '' });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Lỗi khi load sản phẩm:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Lỗi khi load danh mục:', err);
    }
  };

  const updateQuantity = async (id, delta) => {
    const product = products.find((p) => p._id === id);
    if (!product) return;
    const newQty = product.quantity + delta;
    if (newQty < 0) return;
    try {
      await axios.put(`${backendUrl}/api/products/${id}`, { quantity: newQty });
      fetchProducts();
    } catch (err) {
      console.error('Lỗi khi cập nhật tồn kho:', err);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`${backendUrl}/api/products/${id}`, {
        status: currentStatus === 'active' ? 'inactive' : 'active',
      });
      fetchProducts();
    } catch (err) {
      console.error('Lỗi khi đổi trạng thái:', err);
    }
  };

  const filteredProducts = products.filter(p => {
    return (
      (filter.category ? p.category === filter.category : true) &&
      (filter.status ? p.status === filter.status : true) &&
      (filter.search ? p.name.toLowerCase().includes(filter.search.toLowerCase()) : true)
    );
  });

  const totalStock = filteredProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);

  const exportToCSV = () => {
    const rows = [
      ['Tên SP', 'Tồn kho', 'Đã bán', 'Trạng thái'],
      ...filteredProducts.map(p => [
        p.name,
        p.quantity,
        p.sold || 0,
        p.status
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'warehouse.csv';
    a.click();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Quản lý kho</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Tìm sản phẩm..."
          className="border px-3 py-2"
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />

        <select
          className="border px-3 py-2"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option value="">-- Tất cả danh mục --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <select
          className="border px-3 py-2"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">-- Tất cả trạng thái --</option>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
        </select>

        <button
          onClick={exportToCSV}
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <FiDownload /> Xuất Excel
        </button>
      </div>

      <div className="mb-2 text-sm text-gray-600">
        Tổng tồn kho: <span className="font-semibold">{totalStock}</span> sản phẩm
      </div>

      <table className="w-full border border-gray-200 shadow-sm rounded overflow-hidden">
        <thead className="bg-green-100">
          <tr>
            <th className="p-2 border">Tên SP</th>
            <th className="p-2 border">Tồn kho</th>
            <th className="p-2 border">Đã bán</th>
            <th className="p-2 border">Thao tác</th>
            <th className="p-2 border">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(p._id, -1)} className="px-2 bg-gray-200 rounded">-</button>
                  <span>{p.quantity}</span>
                  <button onClick={() => updateQuantity(p._id, 1)} className="px-2 bg-gray-200 rounded">+</button>
                </div>
              </td>
              <td className="p-2 border">{p.sold || 0}</td>
              <td className="p-2 border">
                <button
                  onClick={() => toggleStatus(p._id, p.status)}
                  className={`px-3 py-1 rounded text-white ${p.status === 'active' ? 'bg-red-500' : 'bg-green-500'}`}
                >
                  {p.status === 'active' ? 'Ngừng bán' : 'Bán lại'}
                </button>
              </td>
              <td className="p-2 border">
                {p.status === 'active' ? (
                  <span className="text-green-600">Bán</span>
                ) : (
                  <span className="text-red-500">Ngừng</span>
                )}
              </td>
            </tr>
          ))}
          {filteredProducts.length === 0 && (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-400">
                Không có dữ liệu.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Warehouse;
