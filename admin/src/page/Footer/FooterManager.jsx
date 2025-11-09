import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { PageLoading } from '../../components/Loading';
import PageWrapper from '../../components/PageWrapper';
import { toast } from 'react-toastify';

export default function FooterManager() {
  const [footers, setFooters] = useState([]);
  const [form, setForm] = useState({
    companyInfo: {
      title: '',
      description: '',
    },
    menuLinks: [{ title: '', url: '' }],
    supportInfo: {
      openingHours: '',
      hotline: '',
      salesPhone: '',
      feedbackPhone: '',
      email: '',
    },
    socialLinks: {
      facebook: '',
      instagram: '',
      zalo: '',
      youtube: '',
    },
    copyright: {
      text: '',
      year: '',
      website: '',
    },
    backgroundImage: '',
    status: 'active',
  });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooters();
  }, []);

  const fetchFooters = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${backendUrl}/api/footers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFooters(res.data);
    } catch (err) {
      console.error('Lỗi khi tải footers:', err);
      toast.error('Không thể tải danh sách footer');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    if (section === 'companyInfo' || section === 'supportInfo' || section === 'socialLinks' || section === 'copyright') {
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMenuLinkChange = (index, field, value) => {
    const newLinks = [...form.menuLinks];
    newLinks[index][field] = value;
    setForm((prev) => ({ ...prev, menuLinks: newLinks }));
  };

  const addMenuLink = () => {
    setForm((prev) => ({
      ...prev,
      menuLinks: [...prev.menuLinks, { title: '', url: '' }],
    }));
  };

  const removeMenuLink = (index) => {
    const newLinks = form.menuLinks.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, menuLinks: newLinks }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${backendUrl}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, backgroundImage: res.data.url }));
      toast.success('Upload ảnh thành công');
    } catch (err) {
      toast.error('Upload ảnh thất bại');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.companyInfo?.title || !form.companyInfo.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề công ty!');
      return;
    }

    if (!form.copyright?.text || !form.copyright.text.trim()) {
      toast.error('Vui lòng nhập copyright text!');
      return;
    }

    // Lọc bỏ menu links rỗng trước khi gửi
    const menuLinks = form.menuLinks.filter(
      link => link.title && link.title.trim() && link.url && link.url.trim()
    );

    // Nếu không có menu link nào hợp lệ, thêm một link rỗng để backend không báo lỗi
    const formData = {
      ...form,
      menuLinks: menuLinks.length > 0 ? menuLinks : [{ title: 'Trang chủ', url: '/' }]
    };

    try {
      const token = localStorage.getItem('token');
      if (editing) {
        await axios.put(`${backendUrl}/api/footers/${editing._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Cập nhật footer thành công');
      } else {
        await axios.post(`${backendUrl}/api/footers`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Thêm footer thành công');
      }

      setForm({
        companyInfo: { title: '', description: '' },
        menuLinks: [{ title: '', url: '' }],
        supportInfo: {
          openingHours: '',
          hotline: '',
          salesPhone: '',
          feedbackPhone: '',
          email: '',
        },
        socialLinks: { facebook: '', instagram: '', zalo: '', youtube: '' },
        copyright: { text: '', year: '', website: '' },
        backgroundImage: '',
        status: 'active',
      });
      setEditing(null);
      fetchFooters();
    } catch (err) {
      console.error('Lỗi khi gửi footer:', err.response?.data || err);
      const errorMessage = err.response?.data?.message || 'Không thể tạo/cập nhật footer!';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (footer) => {
    setForm({
      companyInfo: footer.companyInfo || { title: '', description: '' },
      menuLinks: footer.menuLinks?.length > 0 ? footer.menuLinks : [{ title: '', url: '' }],
      supportInfo: footer.supportInfo || {
        openingHours: '',
        hotline: '',
        salesPhone: '',
        feedbackPhone: '',
        email: '',
      },
      socialLinks: footer.socialLinks || { facebook: '', instagram: '', zalo: '', youtube: '' },
      copyright: footer.copyright || { text: '', year: '', website: '' },
      backgroundImage: footer.backgroundImage || '',
      status: footer.status || 'active',
    });
    setEditing(footer);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa footer này?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/api/footers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Xóa footer thành công');
      fetchFooters();
    } catch (err) {
      toast.error('Xóa footer thất bại');
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <PageLoading />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">📄 Quản lý Footer</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 border rounded-lg shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề công ty *</label>
            <input
              name="companyInfo.title"
              value={form.companyInfo.title}
              onChange={handleChange}
              placeholder="VD: Còi Garden"
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả công ty</label>
            <textarea
              name="companyInfo.description"
              value={form.companyInfo.description}
              onChange={handleChange}
              placeholder="Mô tả về công ty"
              className="border p-2 rounded w-full"
              rows="3"
            />
          </div>
        </div>

        {/* Menu Links */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Menu Links</label>
            <button
              type="button"
              onClick={addMenuLink}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Thêm link
            </button>
          </div>
          {form.menuLinks.map((link, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                value={link.title}
                onChange={(e) => handleMenuLinkChange(index, 'title', e.target.value)}
                placeholder="Tiêu đề"
                className="border p-2 rounded flex-1"
              />
              <input
                value={link.url}
                onChange={(e) => handleMenuLinkChange(index, 'url', e.target.value)}
                placeholder="URL"
                className="border p-2 rounded flex-1"
              />
              {form.menuLinks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMenuLink(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Support Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Giờ mở cửa</label>
            <input
              name="supportInfo.openingHours"
              value={form.supportInfo.openingHours}
              onChange={handleChange}
              placeholder="VD: 8h00 - 20h00"
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hotline</label>
            <input
              name="supportInfo.hotline"
              value={form.supportInfo.hotline}
              onChange={handleChange}
              placeholder="VD: 0977 48 1919"
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bán hàng</label>
            <input
              name="supportInfo.salesPhone"
              value={form.supportInfo.salesPhone}
              onChange={handleChange}
              placeholder="VD: 0907 48 1919"
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phản hồi</label>
            <input
              name="supportInfo.feedbackPhone"
              value={form.supportInfo.feedbackPhone}
              onChange={handleChange}
              placeholder="VD: 0923 177779"
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="supportInfo.email"
              value={form.supportInfo.email}
              onChange={handleChange}
              type="email"
              placeholder="VD: info@caybonsai.vn"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Facebook URL</label>
            <input
              name="socialLinks.facebook"
              value={form.socialLinks.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram URL</label>
            <input
              name="socialLinks.instagram"
              value={form.socialLinks.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Zalo URL</label>
            <input
              name="socialLinks.zalo"
              value={form.socialLinks.zalo}
              onChange={handleChange}
              placeholder="https://zalo.me/..."
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Youtube URL</label>
            <input
              name="socialLinks.youtube"
              value={form.socialLinks.youtube}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Copyright Text *</label>
            <input
              name="copyright.text"
              value={form.copyright.text}
              onChange={handleChange}
              placeholder="VD: Bản quyền thuộc"
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Năm</label>
            <input
              name="copyright.year"
              value={form.copyright.year}
              onChange={handleChange}
              placeholder="VD: 2015-2024"
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              name="copyright.website"
              value={form.copyright.website}
              onChange={handleChange}
              placeholder="VD: caybonsai.vn"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Background Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Ảnh nền Footer</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 rounded w-full"
          />
          {form.backgroundImage && (
            <img
              src={form.backgroundImage}
              alt="Background"
              className="w-40 h-24 object-cover rounded mt-2"
            />
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Trạng thái</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {editing ? 'Cập nhật Footer' : 'Thêm Footer'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({
                companyInfo: { title: '', description: '' },
                menuLinks: [{ title: '', url: '' }],
                supportInfo: {
                  openingHours: '',
                  hotline: '',
                  salesPhone: '',
                  feedbackPhone: '',
                  email: '',
                },
                socialLinks: { facebook: '', instagram: '', zalo: '', youtube: '' },
                copyright: { text: '', year: '', website: '' },
                backgroundImage: '',
                status: 'active',
              });
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
          >
            Hủy
          </button>
        )}
      </form>

      {/* Danh sách Footer */}
      <div className="bg-white border rounded-lg shadow overflow-hidden">
        <h3 className="text-xl font-bold p-4 border-b">Danh sách Footer</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {footers.map((footer) => (
                <tr key={footer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{footer.companyInfo?.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      footer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {footer.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(footer.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(footer)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(footer._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {footers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Chưa có footer nào
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
