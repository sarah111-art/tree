import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

export const createProduct = async (req, res) => {
  try {
    const { name, price, category, ...rest } = req.body;

    const foundCategory = await Category.findById(category);
    if (!foundCategory) {
      return res.status(400).json({ message: 'Danh mục không hợp lệ' });
    }

    const newProduct = new Product({
      name,
      price,
      category,
      categorySlug: foundCategory.slug, // 👈 Thêm slug từ danh mục
      ...rest
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('❌ Lỗi tạo sản phẩm:', err.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name slug'); // 👈 Populate để frontend dùng slug
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xoá thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server!', error: err.message });
  }
};

// Sản phẩm bán chạy nhất
export const getBestSellingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const products = await Product.find()
      .sort({ sold: -1 })
      .limit(limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server!', error: err.message });
  }
};

// Sản phẩm mới nhất
export const getNewestProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server!', error: err.message });
  }
};

// Sản phẩm được đánh giá cao nhất
export const getTopRatedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const products = await Product.find()
      .sort({ averageRating: -1 })
      .limit(limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server!', error: err.message });
  }
};
export const addReview = async (req, res) => {
  try {
    const { star, comment, postedBy } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    const newRating = { star, comment, postedBy };
    product.ratings.push(newRating);

    // Cập nhật điểm trung bình
    const total = product.ratings.reduce((acc, r) => acc + r.star, 0);
    product.averageRating = (total / product.ratings.length).toFixed(1);

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server!', error: err.message });
  }
};
