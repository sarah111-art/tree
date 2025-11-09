import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  ComposedChart, ScatterChart, Scatter, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Users, Package, Calendar, Download, Filter,
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon
} from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';
import { PageLoading } from '../../components/Loading';
import axios from 'axios';
import dayjs from 'dayjs';

const Report = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days
  const [reportData, setReportData] = useState({
    // Revenue Analytics
    revenueByMonth: [],
    revenueByDay: [],
    revenueByCategory: [],
    
    // Order Analytics
    ordersByStatus: [],
    ordersByPaymentMethod: [],
    orderTrends: [],
    
    // Product Analytics
    topSellingProducts: [],
    productPerformance: [],
    categoryDistribution: [],
    
    // Customer Analytics
    customerGrowth: [],
    customerSegments: [],
    customerLifetimeValue: [],
    
    // Summary Statistics
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowthRate: 0
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      };

      console.log('Fetching report data...');

      // Fetch all data in parallel
      const [ordersRes, productsRes, usersRes, categoriesRes] = await Promise.all([
        axios.get('https://tree-mmpq.onrender.com/api/orders', { headers }),
        axios.get('https://tree-mmpq.onrender.com/api/products', { headers }),
        axios.get('https://tree-mmpq.onrender.com/api/users', { headers }),
        axios.get('https://tree-mmpq.onrender.com/api/categories', { headers })
      ]);

      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const users = usersRes.data || [];
      const categories = categoriesRes.data || [];

      console.log('Raw API Data:', {
        orders: orders.length,
        products: products.length,
        users: users.length,
        categories: categories.length
      });

      console.log('Sample orders:', orders.slice(0, 2));
      console.log('Sample products:', products.slice(0, 2));

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      // Filter data by date range
      const filteredOrders = orders.filter(order => 
        new Date(order.createdAt) >= startDate && new Date(order.createdAt) <= endDate
      );

      console.log('Filtered orders:', filteredOrders.length);

      // Revenue Analytics
      const revenueByMonth = generateMonthlyRevenueData(filteredOrders);
      const revenueByDay = generateDailyRevenueData(filteredOrders);
      const revenueByCategory = generateCategoryRevenueData(filteredOrders, products, categories);

      console.log('Revenue data:', {
        revenueByMonth: revenueByMonth.length,
        revenueByDay: revenueByDay.length,
        revenueByCategory: revenueByCategory.length
      });

      // Order Analytics
      const ordersByStatus = generateOrderStatusData(filteredOrders);
      const ordersByPaymentMethod = generatePaymentMethodData(filteredOrders);
      const orderTrends = generateOrderTrendsData(filteredOrders);

      // Product Analytics
      const topSellingProducts = generateTopSellingProducts(filteredOrders, products);
      const productPerformance = generateProductPerformanceData(filteredOrders, products);
      const categoryDistribution = generateCategoryDistributionData(products, categories);

      console.log('Product data:', {
        topSellingProducts: topSellingProducts.length,
        categoryDistribution: categoryDistribution.length
      });

      // Customer Analytics
      const customerGrowth = generateCustomerGrowthData(users);
      const customerSegments = generateCustomerSegmentsData(users, filteredOrders);
      const customerLifetimeValue = generateCustomerLifetimeValueData(users, filteredOrders);

      // Summary Statistics
      const totalRevenue = filteredOrders
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      console.log('Total revenue calculation:', {
        totalOrders: filteredOrders.length,
        totalRevenue: totalRevenue,
        orderTotals: filteredOrders.map(o => ({ id: o._id, total: o.total, status: o.status }))
      });
      
      const totalOrders = filteredOrders.length;
      const totalCustomers = users.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // Calculate growth rates (comparing with previous period)
      const previousPeriodStart = new Date(startDate);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - parseInt(dateRange));
      const previousPeriodOrders = orders.filter(order => 
        new Date(order.createdAt) >= previousPeriodStart && 
        new Date(order.createdAt) < startDate
      );
      
      const previousRevenue = previousPeriodOrders
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      const revenueGrowth = previousRevenue > 0 ? 
        ((totalRevenue - previousRevenue) / previousRevenue * 100) : 0;
      
      const orderGrowth = previousPeriodOrders.length > 0 ? 
        ((totalOrders - previousPeriodOrders.length) / previousPeriodOrders.length * 100) : 0;

      // Always use real data from API
      console.log('Using real data from API');
      console.log('Data summary:', { 
        totalRevenue, 
        totalOrders, 
        totalCustomers,
        topSellingProductsCount: topSellingProducts.length,
        revenueByMonthCount: revenueByMonth.length,
        revenueByDayCount: revenueByDay.length
      });
      
      setReportData({
        revenueByMonth,
        revenueByDay,
        revenueByCategory,
        ordersByStatus,
        ordersByPaymentMethod,
        orderTrends,
        topSellingProducts,
        productPerformance,
        categoryDistribution,
        customerGrowth,
        customerSegments,
        customerLifetimeValue,
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageOrderValue,
        conversionRate: 0, // Would need more data to calculate
        revenueGrowth,
        orderGrowth,
        customerGrowthRate: 0 // Would need historical data
      });

    } catch (error) {
      console.error('Error fetching report data:', error);
      console.error('Error details:', error.response?.data);
      
      // Set empty data on error - no sample data
      setReportData({
        revenueByMonth: [],
        revenueByDay: [],
        revenueByCategory: [],
        ordersByStatus: [],
        ordersByPaymentMethod: [],
        orderTrends: [],
        topSellingProducts: [],
        productPerformance: [],
        categoryDistribution: [],
        customerGrowth: [],
        customerSegments: [],
        customerLifetimeValue: [],
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        averageOrderValue: 0,
        conversionRate: 0,
        revenueGrowth: 0,
        orderGrowth: 0,
        customerGrowthRate: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for data generation
  const generateMonthlyRevenueData = (orders) => {
    const monthlyData = {};
    console.log('Processing orders for monthly revenue:', orders.length);
    
    orders.forEach(order => {
      console.log('Order details:', {
        status: order.status,
        total: order.total,
        createdAt: order.createdAt
      });
      
      // Include all orders, not just completed ones
      const month = dayjs(order.createdAt).format('YYYY-MM');
      monthlyData[month] = (monthlyData[month] || 0) + (order.total || 0);
    });
    
    const result = Object.entries(monthlyData).map(([month, revenue]) => ({
      month: dayjs(month).format('MMM YYYY'),
      revenue
    })).sort((a, b) => a.month.localeCompare(b.month));
    
    console.log('Monthly revenue result:', result);
    return result;
  };

  const generateDailyRevenueData = (orders) => {
    const dailyData = {};
    console.log('Processing orders for daily revenue:', orders.length);
    
    orders.forEach(order => {
      // Include all orders, not just completed ones
      const day = dayjs(order.createdAt).format('YYYY-MM-DD');
      dailyData[day] = (dailyData[day] || 0) + (order.total || 0);
    });
    
    const result = Object.entries(dailyData).map(([day, revenue]) => ({
      day: dayjs(day).format('DD/MM'),
      revenue
    })).sort((a, b) => a.day.localeCompare(b.day));
    
    console.log('Daily revenue result:', result);
    return result;
  };

  const generateCategoryRevenueData = (orders, products, categories) => {
    const categoryRevenue = {};
    console.log('Processing category revenue:', { orders: orders.length, products: products.length, categories: categories.length });
    
    orders.forEach(order => {
      // Include all orders, not just completed ones
      order.items?.forEach(item => {
        console.log('Processing item:', item);
        const product = products.find(p => p._id === item.product);
        console.log('Found product:', product);
        
        if (product && product.category) {
          const category = categories.find(c => c._id === product.category);
          console.log('Found category:', category);
          
          if (category) {
            const itemRevenue = item.quantity * (product.price || 0);
            categoryRevenue[category.name] = (categoryRevenue[category.name] || 0) + itemRevenue;
            console.log('Added revenue:', itemRevenue, 'to category:', category.name);
          }
        }
      });
    });
    
    const result = Object.entries(categoryRevenue).map(([category, revenue]) => ({
      category,
      revenue
    }));
    
    console.log('Category revenue result:', result);
    return result;
  };

  const generateOrderStatusData = (orders) => {
    const statusCount = {};
    orders.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });
    
    return Object.entries(statusCount).map(([status, count]) => ({
      status: status === 'completed' ? 'Hoàn thành' : 
              status === 'pending' ? 'Chờ xử lý' : 'Đã hủy',
      count
    }));
  };

  const generatePaymentMethodData = (orders) => {
    const paymentCount = {};
    orders.forEach(order => {
      const method = order.paymentMethod || 'unknown';
      paymentCount[method] = (paymentCount[method] || 0) + 1;
    });
    
    return Object.entries(paymentCount).map(([method, count]) => ({
      method: method === 'momo' ? 'MoMo' : 
              method === 'vnpay' ? 'VNPay' : 
              method === 'bank' ? 'Chuyển khoản' : 'Khác',
      count
    }));
  };

  const generateOrderTrendsData = (orders) => {
    const dailyOrders = {};
    orders.forEach(order => {
      const day = dayjs(order.createdAt).format('YYYY-MM-DD');
      dailyOrders[day] = (dailyOrders[day] || 0) + 1;
    });
    
    return Object.entries(dailyOrders).map(([day, count]) => ({
      day: dayjs(day).format('DD/MM'),
      orders: count
    })).sort((a, b) => a.day.localeCompare(b.day));
  };

  const generateTopSellingProducts = (orders, products) => {
    const productSales = {};
    console.log('Processing top selling products:', { orders: orders.length, products: products.length });
    
    orders.forEach(order => {
      order.items?.forEach(item => {
        console.log('Processing item for top selling:', item);
        productSales[item.product] = (productSales[item.product] || 0) + item.quantity;
      });
    });
    
    const result = Object.entries(productSales)
      .map(([productId, quantity]) => {
        const product = products.find(p => p._id === productId);
        console.log('Product found:', product, 'for ID:', productId);
        return {
          name: product?.name || 'Unknown Product',
          quantity,
          revenue: quantity * (product?.price || 0)
        };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
    
    console.log('Top selling products result:', result);
    return result;
  };

  const generateProductPerformanceData = (orders, products) => {
    return products.slice(0, 10).map(product => {
      const productOrders = orders.filter(order => 
        order.items?.some(item => item.product === product._id)
      );
      const totalQuantity = productOrders.reduce((sum, order) => {
        const item = order.items?.find(item => item.product === product._id);
        return sum + (item?.quantity || 0);
      }, 0);
      
      return {
        name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
        sales: totalQuantity,
        revenue: totalQuantity * (product.price || 0)
      };
    });
  };

  const generateCategoryDistributionData = (products, categories) => {
    return categories.map(category => {
      const categoryProducts = products.filter(product => product.category === category._id);
      return {
        name: category.name,
        value: categoryProducts.length
      };
    });
  };

  const generateCustomerGrowthData = (users) => {
    const monthlyUsers = {};
    users.forEach(user => {
      const month = dayjs(user.createdAt).format('YYYY-MM');
      monthlyUsers[month] = (monthlyUsers[month] || 0) + 1;
    });
    
    return Object.entries(monthlyUsers).map(([month, count]) => ({
      month: dayjs(month).format('MMM YYYY'),
      users: count
    })).sort((a, b) => a.month.localeCompare(b.month));
  };

  const generateCustomerSegmentsData = (users, orders) => {
    const segments = {
      'Khách hàng mới': 0,
      'Khách hàng thường xuyên': 0,
      'Khách hàng VIP': 0
    };
    
    users.forEach(user => {
      const userOrders = orders.filter(order => order.user === user._id);
      const orderCount = userOrders.length;
      
      if (orderCount === 0) segments['Khách hàng mới']++;
      else if (orderCount < 5) segments['Khách hàng thường xuyên']++;
      else segments['Khách hàng VIP']++;
    });
    
    return Object.entries(segments).map(([segment, count]) => ({
      segment,
      count
    }));
  };

  const generateCustomerLifetimeValueData = (users, orders) => {
    return users.slice(0, 10).map(user => {
      const userOrders = orders.filter(order => order.user === user._id);
      const totalSpent = userOrders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      return {
        customer: user.name || user.email,
        value: totalSpent,
        orders: userOrders.length
      };
    }).sort((a, b) => b.value - a.value);
  };

  const exportReport = () => {
    // Simple export functionality - could be enhanced with PDF generation
    const reportSummary = {
      'Tổng doanh thu': reportData.totalRevenue.toLocaleString() + ' VNĐ',
      'Tổng đơn hàng': reportData.totalOrders,
      'Tổng khách hàng': reportData.totalCustomers,
      'Giá trị đơn hàng trung bình': reportData.averageOrderValue.toLocaleString() + ' VNĐ',
      'Tăng trưởng doanh thu': reportData.revenueGrowth.toFixed(2) + '%',
      'Tăng trưởng đơn hàng': reportData.orderGrowth.toFixed(2) + '%'
    };
    
    const dataStr = JSON.stringify(reportSummary, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${dayjs().format('YYYY-MM-DD')}.json`;
    link.click();
  };

  const COLORS = ['#FF6384', '#36A2EB', '#4BC0C0', '#FFCE56', '#9966FF', '#FF9F40', '#FF6B6B', '#4ECDC4'];

  if (loading) {
    return (
      <PageWrapper>
        <PageLoading />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className='p-6'>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Báo cáo trực quan</h1>
            <p className="text-gray-600 mt-1">Phân tích chi tiết về hiệu suất kinh doanh</p>
            {reportData.totalRevenue > 0 && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  <strong>✓</strong> Đang hiển thị dữ liệu thực từ hệ thống.
                </p>
              </div>
            )}
            {reportData.totalRevenue === 0 && reportData.totalOrders === 0 && (
              <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-800 text-sm">
                  <strong>ℹ</strong> Chưa có dữ liệu trong khoảng thời gian được chọn.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">7 ngày qua</option>
              <option value="30">30 ngày qua</option>
              <option value="90">90 ngày qua</option>
              <option value="365">1 năm qua</option>
            </select>
            
            <button
              onClick={exportReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Tổng doanh thu</p>
                <p className="text-2xl font-bold">{reportData.totalRevenue.toLocaleString()} VNĐ</p>
                <div className="flex items-center mt-2">
                  {reportData.revenueGrowth >= 0 ? (
                    <TrendingUp size={16} className="text-green-300" />
                  ) : (
                    <TrendingDown size={16} className="text-red-300" />
                  )}
                  <span className={`text-sm ml-1 ${reportData.revenueGrowth >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {Math.abs(reportData.revenueGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <DollarSign size={32} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Tổng đơn hàng</p>
                <p className="text-2xl font-bold">{reportData.totalOrders}</p>
                <div className="flex items-center mt-2">
                  {reportData.orderGrowth >= 0 ? (
                    <TrendingUp size={16} className="text-green-300" />
                  ) : (
                    <TrendingDown size={16} className="text-red-300" />
                  )}
                  <span className={`text-sm ml-1 ${reportData.orderGrowth >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {Math.abs(reportData.orderGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <ShoppingCart size={32} className="text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Tổng khách hàng</p>
                <p className="text-2xl font-bold">{reportData.totalCustomers}</p>
                <div className="flex items-center mt-2">
                  <Users size={16} className="text-purple-300" />
                  <span className="text-sm ml-1 text-purple-300">Đang hoạt động</span>
                </div>
              </div>
              <Users size={32} className="text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
    <div>
                <p className="text-orange-100 text-sm">Giá trị đơn hàng TB</p>
                <p className="text-2xl font-bold">{reportData.averageOrderValue.toLocaleString()} VNĐ</p>
                <div className="flex items-center mt-2">
                  <Package size={16} className="text-orange-300" />
                  <span className="text-sm ml-1 text-orange-300">Trung bình</span>
                </div>
              </div>
              <Package size={32} className="text-orange-200" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Month */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-blue-600" size={20} />
              <h3 className="text-lg font-semibold">Doanh thu theo tháng</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} VNĐ`, 'Doanh thu']} />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by Category
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="text-green-600" size={20} />
              <h3 className="text-lg font-semibold">Doanh thu theo danh mục</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.revenueByCategory}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                >
                  {reportData.revenueByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value.toLocaleString()} VNĐ`, 'Doanh thu']} />
              </PieChart>
            </ResponsiveContainer>
          </div> */}

          {/* Daily Revenue Trend */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <LineChartIcon className="text-purple-600" size={20} />
              <h3 className="text-lg font-semibold">Xu hướng doanh thu hàng ngày</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={reportData.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} VNĐ`, 'Doanh thu']} />
                <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="text-orange-600" size={20} />
              <h3 className="text-lg font-semibold">Phân bố trạng thái đơn hàng</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.ordersByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                >
                  {reportData.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, 'Số lượng']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-red-600" size={20} />
              <h3 className="text-lg font-semibold">Sản phẩm bán chạy nhất</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.topSellingProducts.slice(0, 8)} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value}`, 'Số lượng bán']} />
                <Bar dataKey="quantity" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Segments */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-indigo-600" size={20} />
              <h3 className="text-lg font-semibold">Phân khúc khách hàng</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.customerSegments}
                  dataKey="count"
                  nameKey="segment"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ segment, percent }) => `${segment} ${(percent * 100).toFixed(0)}%`}
                >
                  {reportData.customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, 'Số lượng']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Customers by Value */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Khách hàng có giá trị cao nhất</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Khách hàng</th>
                    <th className="text-right py-2">Giá trị</th>
                    <th className="text-right py-2">Đơn hàng</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.customerLifetimeValue.slice(0, 5).map((customer, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{customer.customer}</td>
                      <td className="text-right py-2">{customer.value.toLocaleString()} VNĐ</td>
                      <td className="text-right py-2">{customer.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán</h3>
            <div className="space-y-3">
              {reportData.ordersByPaymentMethod.map((method, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="font-medium">{method.method}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(method.count / reportData.totalOrders) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{method.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
    </PageWrapper>
  );
};

export default Report;
