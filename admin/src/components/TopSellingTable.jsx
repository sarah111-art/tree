import React, { useState, useEffect } from 'react';
import { TableLoading } from './Loading';

const products = [
  { name: 'Product 1', price: '$564', discount: '#DE2548', sold: 60, source: 'Google' },
  { name: 'Product 1', price: '$564', discount: '#DE2548', sold: 60, source: 'Direct' },
  { name: 'Product 1', price: '$564', discount: '#DE2548', sold: 60, source: 'Email' },
  { name: 'Product 1', price: '$564', discount: '#DE2548', sold: 60, source: 'Referral' },
  { name: 'Product 1', price: '$564', discount: '#DE2548', sold: 60, source: 'Direct' },
  { name: 'Product 1', price: '$564', discount: '#DE2548', sold: 60, source: 'Referral' },
];

const sourceColor = {
  Google: 'text-red-500',
  Direct: 'text-green-500',
  Email: 'text-orange-500',
  Referral: 'text-blue-500',
};

const TopSellingTable = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <TableLoading />;
  }

  return (
    <div className="bg-white p-4 rounded shadow overflow-auto">
      <h2 className="text-lg font-semibold mb-2">Top Selling Products</h2>
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Product</th>
            <th className="p-2">Price</th>
            <th className="p-2">Discount</th>
            <th className="p-2">Sold</th>
            <th className="p-2">Source</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.price}</td>
              <td className="p-2">{item.discount}</td>
              <td className="p-2">{item.sold}</td>
              <td className={`p-2 ${sourceColor[item.source]}`}>{item.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopSellingTable;
