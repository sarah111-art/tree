import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getBestSellingProducts,
  getNewestProducts,
  getTopRatedProducts,
  addReview,
} from '../controllers/productController.js';
const productRouter = express.Router();

// Route đặc biệt: đặt lên đầu
productRouter.get('/best-sellers', getBestSellingProducts);
productRouter.get('/newest', getNewestProducts);
productRouter.get('/top-rated', getTopRatedProducts);
productRouter.post('/:id/review', addReview);

// Các route CRUD cơ bản
productRouter.post('/', createProduct);
productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProductById);
productRouter.put('/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);


export default productRouter;
