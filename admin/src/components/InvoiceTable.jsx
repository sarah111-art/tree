import React, { useState, useEffect } from 'react';
import { TableLoading } from './Loading';

const invoices = [
  { customer: 'Customer', product: 'Sunglass', invoice: '#DE2548', price: '$350', status: 'Pending' },
  { customer: 'Customer', product: 'Sunglass', invoice: '#DE2548', price: '$350', status: 'Paid' },
  { customer: 'Customer', product: 'Sunglass', invoice: '#DE2548', price: '$350', status: 'Shipped' },
  { customer: 'Customer', product: 'Sunglass', invoice: '#DE2548', price: '$350', status: 'Shipped' },
  { customer: 'Customer', product: 'Sunglass', invoice: '#DE2548', price: '$350', status: 'Paid' },
  { customer: 'Customer', product: 'Sunglass', invoice: '#DE2548', price: '$350', status: 'Delivered' },
];

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Paid: 'bg-purple-100 text-purple-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
};

const InvoiceTable = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <TableLoading />;
  }

  return (
    <div className="bg-white p-4 rounded shadow overflow-auto">
      <h2 className="text-lg font-semibold mb-2">Monthly Invoices</h2>
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Customer</th>
            <th className="p-2">Product</th>
            <th className="p-2">Invoice</th>
            <th className="p-2">Price</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((item, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="p-2">{item.customer}</td>
              <td className="p-2 text-orange-600">{item.product}</td>
              <td className="p-2">{item.invoice}</td>
              <td className="p-2">{item.price}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[item.status]}`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
