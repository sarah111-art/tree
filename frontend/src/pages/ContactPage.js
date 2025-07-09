import React, { useState } from 'react';
import axios from '../api';
import { backendUrl } from '../context/ShopContext';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/contacts`, form);
      alert('✅ Đã gửi liên hệ thành công!');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      alert('❌ Gửi liên hệ thất bại!');
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-2 gap-8">
      {/* Form liên hệ */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-2 text-green-700">📞 Liên hệ với chúng tôi</h2>
        <input
          className="border p-2 w-full rounded"
          placeholder="Họ và tên"
          required
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
        <textarea
          className="border p-2 w-full rounded h-32"
          placeholder="Nội dung liên hệ"
          required
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Gửi liên hệ
        </button>
      </form>

      {/* Bản đồ Google Maps */}
      <div className="rounded overflow-hidden shadow-md h-[400px]">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.199448049274!2d106.67998327480536!3d10.794714958812588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528c5d32e83e7%3A0xf61a7f3bb7e34e48!2zMTE1IMSQLiBOZ3V54buFbiBUcmkgUGjhu6cgQW4sIFBoxrDhu51uZyA3LCBRdeG6rW4gMywgSOG7kyBDaMOtbmggTWluaCwgVMOibiBwaOG7kSBI4buTIENow60gTWluaA!5e0!3m2!1sen!2s!4v1720347123456"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
