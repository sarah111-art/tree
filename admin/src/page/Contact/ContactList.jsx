import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import dayjs from 'dayjs';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [replyingId, setReplyingId] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchContacts = async () => {
    const res = await axios.get(`${backendUrl}/api/contacts`, {
      params: { page, limit },
    });
    setContacts(res.data.data || []);
    setPages(res.data.pages || 1);
    setTotal(res.data.total || 0);
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
  }, [page, limit]);

  return (
    <div className="p-6">
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

      {/* Pagination Controls */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-gray-600">
          Tổng: <span className="font-medium">{total}</span> liên hệ
          {total > 0 && (
            <span className="ml-2">(Trang {page}/{pages})</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded border ${
              page === 1
                ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            ← Trước
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: pages || 1 }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`min-w-[36px] h-9 px-2 rounded border text-sm ${
                  p === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages || pages === 0}
            className={`px-3 py-1 rounded border ${
              page === pages || pages === 0
                ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Sau →
          </button>

          <select
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
            className="ml-2 border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5/trang</option>
            <option value={10}>10/trang</option>
            <option value={20}>20/trang</option>
            <option value={50}>50/trang</option>
          </select>
        </div>
      </div>
    </div>
  );
}
