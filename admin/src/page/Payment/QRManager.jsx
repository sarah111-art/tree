// src/pages/Admin/QRManager.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../api';
import { backendUrl } from '../../App';

export default function QRManager() {
  const [qrs, setQrs] = useState([]);
  const [type, setType] = useState('momo');
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');

  const fetchQR = async () => {
    const res = await axios.get(`${backendUrl}/api/qr`);
    setQrs(res.data);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const res = await axios.post(`${backendUrl}/api/upload`, formData);
    setImage(res.data.url);
    setPreview(res.data.url);
  };

  const handleSubmit = async () => {
    await axios.post(`${backendUrl}/api/qr`, { type, imageUrl: image });
    alert('✅ Mã QR đã cập nhật!');
    fetchQR();
    setImage('');
    setPreview('');
  };

  useEffect(() => {
    fetchQR();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🧾 Quản lý mã QR thanh toán</h2>

      <div className="space-y-4 mb-6">
        <select value={type} onChange={(e) => setType(e.target.value)} className="border px-3 py-2">
          <option value="momo">Ví MoMo</option>
          <option value="bank">Chuyển khoản ngân hàng</option>
        </select>

        <input type="file" onChange={handleUpload} />
        {preview && <img src={preview} alt="QR Preview" className="w-40 border" />}

        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
          Lưu mã QR
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-2">📸 Mã QR đang sử dụng:</h3>
      <div className="grid grid-cols-2 gap-4">
        {qrs.map((q) => (
          <div key={q._id}>
            <h4 className="font-semibold capitalize">{q.type}</h4>
            <img src={q.imageUrl} alt={q.type} className="w-40 border" />
          </div>
        ))}
      </div>
    </div>
  );
}
