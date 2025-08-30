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
import axios from 'axios';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    revenue: [],
    orders: [],
    products: [],
    users: [],
    categories: [],
    monthlyRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    topSellingProducts: [],
    recentOrders: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          ordersResponse,
          productsResponse,
          usersResponse,
          categoriesResponse
        ] = await Promise.all([
          axios.get('https://tree-mmpq.onrender.com/api/orders'),
          axios.get('https://tree-mmpq.onrender.com/api/products'),
          axios.get('https://tree-mmpq.onrender.com/api/users'),
          axios.get('https://tree-mmpq.onrender.com/api/categories')
        ]);

        const orders = ordersResponse.data.orders || [];
        const products = productsResponse.data.products || [];
        const users = usersResponse.data.users || [];
        const categories = categoriesResponse.data.categories || [];

        // Calculate revenue data
        const monthlyRevenue = orders
          .filter(order => order.status === 'completed')
          .reduce((total, order) => total + (order.totalAmount || 0), 0);

        // Generate revenue chart data (last 12 months)
        const revenueData = [...Array(12)].map((_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (11 - i));
          const monthOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === date.getMonth() && 
                   orderDate.getFullYear() === date.getFullYear() &&
                   order.status === 'completed';
          });
          const monthRevenue = monthOrders.reduce((total, order) => total + (order.totalAmount || 0), 0);
          
          return {
            name: date.toLocaleString('vi', { month: 'short' }),
            revenue: monthRevenue
          };
        });

        // Generate category distribution data
        const categoryData = categories.map(category => {
          const categoryProducts = products.filter(product => product.category === category._id);
          return {
            name: category.name,
            value: categoryProducts.length
          };
        });

        // Generate daily sales data (last 7 days)
        const dailySalesData = [...Array(7)].map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dayOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === date.toDateString() &&
                   order.status === 'completed';
          });
          const dayRevenue = dayOrders.reduce((total, order) => total + (order.totalAmount || 0), 0);
          
          return {
            name: date.toLocaleString('vi', { weekday: 'short' }),
            revenue: dayRevenue
          };
        });

        // Get top selling products
        const productSales = {};
        orders.forEach(order => {
          order.items?.forEach(item => {
            if (productSales[item.product]) {
              productSales[item.product] += item.quantity;
            } else {
              productSales[item.product] = item.quantity;
            }
          });
        });

        const topSellingProducts = Object.entries(productSales)
          .map(([productId, quantity]) => {
            const product = products.find(p => p._id === productId);
            return {
              id: productId,
              name: product?.name || 'Unknown Product',
              quantity: quantity,
              revenue: quantity * (product?.price || 0)
            };
          })
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        // Get recent orders
        const recentOrders = orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setDashboardData({
          revenue: revenueData,
          orders: orders,
          products: products,
          users: users,
          categories: categoryData,
          monthlyRevenue: monthlyRevenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalUsers: users.length,
          topSellingProducts: topSellingProducts,
          recentOrders: recentOrders,
          dailySales: dailySalesData
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <PageLoading />
      </PageWrapper>
    );
  }

  const COLORS = ['#FF6384', '#36A2EB', '#4BC0C0', '#FFCE56', '#9966FF', '#FF9F40'];

  return (
    <PageWrapper>
      <div className="grid grid-cols-12 gap-4">

      {/* Revenue Chart */}
      <div className="col-span-12 md:col-span-8 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Doanh thu theo tháng</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dashboardData.revenue}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} VNĐ`} />
            <Bar dataKey="revenue" fill="#2dd4bf" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution */}
      <div className="col-span-12 md:col-span-4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Phân bố danh mục</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={dashboardData.categories} dataKey="value" innerRadius={40} outerRadius={80}>
              {dashboardData.categories.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Revenue */}
      <div className="col-span-12 md:col-span-4 bg-slate-800 text-white p-4 rounded shadow">
        <h2 className="text-sm uppercase">Doanh thu tháng này</h2>
        <p className="text-2xl font-bold mt-2">{dashboardData.monthlyRevenue.toLocaleString()} VNĐ</p>
        <p className="text-green-400 text-sm">↑ Tổng doanh thu đã hoàn thành</p>
      </div>

      {/* Total Orders */}
      <div className="col-span-12 md:col-span-4 bg-white p-4 rounded shadow text-center">
        <h2 className="text-lg font-semibold mb-1">Tổng đơn hàng</h2>
        <p className="text-4xl font-bold text-blue-600">{dashboardData.totalOrders}</p>
        <p className="text-gray-500 text-sm">Tất cả đơn hàng</p>
      </div>

      {/* Total Products */}
      <div className="col-span-12 md:col-span-4 bg-white p-4 rounded shadow text-center">
        <h2 className="text-lg font-semibold mb-1">Tổng sản phẩm</h2>
        <p className="text-4xl font-bold text-green-600">{dashboardData.totalProducts}</p>
        <p className="text-gray-500 text-sm">Sản phẩm trong kho</p>
      </div>

      {/* Daily Sales */}
      <div className="col-span-12 md:col-span-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Doanh thu theo ngày (7 ngày gần nhất)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dashboardData.dailySales}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} VNĐ`} />
            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Selling Products */}
      <div className="col-span-12 md:col-span-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Sản phẩm bán chạy</h2>
        <div className="space-y-3">
          {dashboardData.topSellingProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">Đã bán: {product.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{product.revenue.toLocaleString()} VNĐ</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="col-span-12 md:col-span-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Đơn hàng gần đây</h2>
        <div className="space-y-2">
          {dashboardData.recentOrders.map((order) => (
            <div key={order._id} className="flex items-center justify-between p-2 border-b border-gray-100">
              <div>
                <p className="font-medium text-sm">Đơn hàng #{order._id.slice(-6)}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{order.totalAmount?.toLocaleString()} VNĐ</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status === 'completed' ? 'Hoàn thành' :
                   order.status === 'pending' ? 'Chờ xử lý' : 'Đã hủy'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Statistics */}
      <div className="col-span-12 md:col-span-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Thống kê người dùng</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded">
            <p className="text-2xl font-bold text-blue-600">{dashboardData.totalUsers}</p>
            <p className="text-sm text-gray-600">Tổng người dùng</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <p className="text-2xl font-bold text-green-600">
              {dashboardData.orders.filter(order => order.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-600">Đơn hàng hoàn thành</p>
          </div>
        </div>
      </div>

      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
