import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import Category from '../models/categoryModel.js';
import User from '../models/userModel.js';

export const globalSearch = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
      return res.json({ results: [] });
    }

    const searchTerm = query.trim().toLowerCase();
    const results = [];

    // Search Products
    const products = await Product.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { slug: { $regex: searchTerm, $options: 'i' } }
      ]
    }).populate('category', 'name slug').limit(5);

    products.forEach(product => {
      results.push({
        id: product._id,
        type: 'product',
        title: product.name,
        subtitle: product.category?.name || 'Sản phẩm',
        path: `/admin/products`,
        icon: '📦'
      });
    });

    // Search Orders
    const orders = await Order.find({
      $or: [
        { orderNumber: { $regex: searchTerm, $options: 'i' } },
        { 'customer.name': { $regex: searchTerm, $options: 'i' } },
        { 'customer.email': { $regex: searchTerm, $options: 'i' } }
      ]
    }).limit(3);

    orders.forEach(order => {
      results.push({
        id: order._id,
        type: 'order',
        title: `Đơn hàng #${order.orderNumber}`,
        subtitle: order.customer?.name || order.customer?.email || 'Khách hàng',
        path: `/admin/orders`,
        icon: '📋'
      });
    });

    // Search Categories
    const categories = await Category.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { slug: { $regex: searchTerm, $options: 'i' } }
      ]
    }).limit(3);

    categories.forEach(category => {
      results.push({
        id: category._id,
        type: 'category',
        title: category.name,
        subtitle: 'Danh mục sản phẩm',
        path: `/admin/categories`,
        icon: '📁'
      });
    });

    // Search Users (only for admin/manager)
    const users = await User.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ]
    }).limit(3);

    users.forEach(user => {
      results.push({
        id: user._id,
        type: 'user',
        title: user.name,
        subtitle: user.email,
        path: `/admin/users`,
        icon: '👤'
      });
    });

    res.json({ results });
  } catch (error) {
    console.error('❌ Lỗi search:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
