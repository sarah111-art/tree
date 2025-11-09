import React from 'react';
import { motion } from 'framer-motion';
import phone from '../assets/icons/phone.png';
import zalo from '../assets/icons/zalo.png';
import mess from '../assets/icons/mess.png';

export default function FloatingContacts() {
  return (
    <div className="fixed right-2 bottom-20 flex flex-col items-end gap-3 z-50">
      {/* Gọi điện thoại */}
      <motion.a
        href="tel:0898123456"
        className="bg-white shadow-lg rounded-full p-2 flex items-center gap-2 border"
        animate={{ rotate: [0, 2, -2, 2, -2, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <img src={phone} alt="Phone" className="w-8 h-8 rounded-full" />
        <span className="bg-green-600 text-white px-2 py-1 rounded-lg text-xs">
          Hotline: 0898 123 456
        </span>
      </motion.a>

      {/* Zalo */}
      <motion.a
        href="https://zalo.me/0898123456"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white shadow-lg rounded-full p-1 border"
        animate={{ rotate: [0, -2, 2, -2, 2, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <img src={zalo} alt="Zalo" className="w-10 h-10 rounded-full" />
      </motion.a>

      {/* Messenger */}
      <motion.a
        href="https://m.me/yourpageid"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white shadow-lg rounded-full p-1 border"
        animate={{ rotate: [0, 1.5, -1.5, 1.5, -1.5, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <img src={mess} alt="Messenger" className="w-10 h-10 rounded-full" />
      </motion.a>
    </div>
  );
}
