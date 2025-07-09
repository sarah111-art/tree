// src/page/Staff/ActivityLog.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import dayjs from 'dayjs';
import { backendUrl } from '../../App';

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/logs`);
      setLogs(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy log:', err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">📜 Lịch sử hoạt động của nhân viên</h2>
      <div className="bg-white shadow rounded divide-y">
        {logs.map((log) => (
          <div key={log._id} className="p-4 hover:bg-gray-50">
            <div className="font-semibold text-blue-700">{log.action}</div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{log.staff?.name}</span> 
              đã thao tác lên <span className="font-medium">{log.targetType}</span> 
              (ID: {log.targetId}) vào lúc {dayjs(log.createdAt).format('DD/MM/YYYY HH:mm')}
            </div>
            {log.metadata && (
              <div className="text-sm mt-1 text-gray-500">
                Thông tin: {JSON.stringify(log.metadata)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
