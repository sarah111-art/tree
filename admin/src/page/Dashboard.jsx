import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer
} from 'recharts';
import InvoiceTable from '../components/InvoiceTable';
import TopSellingTable from '../components/TopSellingTable';
import PageWrapper from '../components/PageWrapper';
import { PageLoading } from '../components/Loading';


const barData = [...Array(12)].map((_, i) => ({
  name: new Date(0, i).toLocaleString('en', { month: 'short' }),
  revenue: Math.floor(Math.random() * 40 + 10) * 1000
}));

const pieData = [
  { name: 'A', value: 25 },
  { name: 'B', value: 25 },
  { name: 'C', value: 25 },
  { name: 'D', value: 25 },
];
const COLORS = ['#FF6384', '#36A2EB', '#4BC0C0', '#343A40'];

const radarData = [
  { day: 'Sunday', value: 30 },
  { day: 'Monday', value: 90 },
  { day: 'Tuesday', value: 70 },
  { day: 'Wednesday', value: 50 },
  { day: 'Thursday', value: 60 },
  { day: 'Friday', value: 80 },
  { day: 'Saturday', value: 40 },
];

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for dashboard data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <PageLoading />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="grid grid-cols-12 gap-4">

      {/* Revenue Chart */}
      <div className="col-span-12 md:col-span-8 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Revenue</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#2dd4bf" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="col-span-12 md:col-span-4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Total Sales Unit</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} dataKey="value" innerRadius={40} outerRadius={80}>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Revenue */}
      <div className="col-span-12 md:col-span-4 bg-slate-800 text-white p-4 rounded shadow">
        <h2 className="text-sm uppercase">This Month Revenue</h2>
        <p className="text-2xl font-bold mt-2">$57k</p>
        <p className="text-green-400 text-sm">↑ 14.5% Up from Last Month</p>
      </div>

      {/* Report Button */}
      <div className="col-span-12 md:col-span-4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold">Download your earnings report</h2>
        <p className="text-gray-500 text-sm mb-4">There are many variations of passages.</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Create Report</button>
      </div>

      {/* Line Chart */}
      <div className="col-span-12 md:col-span-4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Daily Sales</h2>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={barData}>
            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Bars */}
      <div className="col-span-12 md:col-span-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Summary</h2>
        <div className="space-y-2">
          <div>
            <p className="text-sm">Marketing <span className="float-right">25%</span></p>
            <div className="bg-gray-200 h-2 rounded"><div className="bg-yellow-400 h-2 rounded w-[25%]" /></div>
          </div>
          <div>
            <p className="text-sm">Sales <span className="float-right">75%</span></p>
            <div className="bg-gray-200 h-2 rounded"><div className="bg-blue-500 h-2 rounded w-[75%]" /></div>
          </div>
          <div>
            <p className="text-sm">Development <span className="float-right">34%</span></p>
            <div className="bg-gray-200 h-2 rounded"><div className="bg-green-400 h-2 rounded w-[34%]" /></div>
          </div>
        </div>
      </div>

      {/* Total Orders */}
      <div className="col-span-12 md:col-span-6 bg-white p-4 rounded shadow text-center">
        <h2 className="text-lg font-semibold mb-1">Total Order</h2>
        <p className="text-4xl font-bold text-blue-600">356</p>
        <p className="text-gray-500 text-sm">Today | This Week</p>
      </div>

      {/* Radar Chart */}
      <div className="col-span-12 md:col-span-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Market value</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart outerRadius={100} data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="day" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar dataKey="value" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Invoices Table */}
      <div className="col-span-12 md:col-span-6">
        <InvoiceTable />
      </div>

      {/* Top Selling Products Table */}
      <div className="col-span-12 md:col-span-6">
        <TopSellingTable />
      </div>

      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
