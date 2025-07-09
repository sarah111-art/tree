// src/components/Loading.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin text-green-600 w-10 h-10" />
    </div>
  );
}
