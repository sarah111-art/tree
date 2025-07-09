import React, { useEffect, useState } from 'react';
import api from '../api';
import { backendUrl } from '../../App';
import dayjs from 'dayjs';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [replyingId, setReplyingId] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  const fetchContacts = async () => {
    const res = await axios.get(`${backendUrl}/api/contacts`);
    setContacts(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`${backendUrl}/api/contacts/${id}`, { status });
    fetchContacts();
  };

  const handleReply = async (contactId) => {
    if (!replyMessage.trim()) {
      alert('❗ Nội dung phản hồi không được để trống!');
      return;
    }

    try {
      await axios.post(`${backendUrl}/api/contacts/${contactId}/reply`, {
        message: replyMessage,
      });

      alert('✅ Đã gửi phản hồi!');
      setReplyingId(null);
      setReplyMessage('');
      fetchContacts();
    } catch (err) {
      console.error(err);
      alert('❌ Gửi phản hồi thất bại!');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl font-bold mb-4">📩 Quản lý liên hệ</h2>

      <div className="grid gap-4">
        {contacts.map((c) => (
          <div
            key={c._id}
            className="border rounded-lg p-4 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <div className="font-semibold text-base">
                👤 {c.name}
                {c.phone && (
                  <span className="text-sm text-gray-500 ml-2">📞 {c.phone}</span>
                )}
                {c.email && (
                  <span className="text-sm text-gray-500 ml-2">📧 {c.email}</span>
                )}
              </div>
              <div className="text-sm text-gray-400 mt-1 sm:mt-0">
                {dayjs(c.createdAt).format('HH:mm DD/MM/YYYY')}
              </div>
            </div>

            <div className="mt-2 text-gray-700">{c.message}</div>

            <div className="mt-2 text-sm">
              Trạng thái:{' '}
              <span
                className={
                  c.status === 'processed'
                    ? 'text-green-600 font-medium'
                    : 'text-orange-500 font-medium'
                }
              >
                {c.status === 'processed' ? 'Đã xử lý' : 'Chưa xử lý'}
              </span>

              {c.status === 'pending' && (
                <button
                  onClick={() => updateStatus(c._id, 'processed')}
                  className="ml-4 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  ✅ Đánh dấu đã xử lý
                </button>
              )}

              <button
                onClick={() =>
                  setReplyingId(replyingId === c._id ? null : c._id)
                }
                className="ml-4 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                ✉️ Phản hồi
              </button>
            </div>

            {/* Form phản hồi */}
            {replyingId === c._id && (
              <div className="mt-3">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Nhập nội dung phản hồi..."
                  rows={3}
                  className="w-full border px-3 py-2 rounded"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleReply(c._id)}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    🚀 Gửi phản hồi
                  </button>
                  <button
                    onClick={() => {
                      setReplyingId(null);
                      setReplyMessage('');
                    }}
                    className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
