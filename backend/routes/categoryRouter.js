// routes/categoryRoutes.js
import express from 'express';
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from '../controllers/categoryController.js';

const categoryRoutes = express.Router();

categoryRoutes.post('/', createCategory);
categoryRoutes.get('/', getAllCategories);
categoryRoutes.put('/:id', updateCategory);
categoryRoutes.get('/:id', getCategoryById);
categoryRoutes.delete('/:id', deleteCategory);

export default categoryRoutes;
