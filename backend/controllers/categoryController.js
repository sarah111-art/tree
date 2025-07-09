// controllers/categoryController.js
import Category from '../models/categoryModel.js';
import slugify from 'slugify';

// Thêm danh mục
export const createCategory = async (req, res) => {
  try {
    const { name, description, image, parent } = req.body; // 👈 thêm parent
    const slug = slugify(name, { lower: true, strict: true });

    const existing = await Category.findOne({ slug });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    const newCategory = await Category.create({
      name,
      description,
      image,
      slug,
      parent: parent || null, // 👈 gán parent nếu có
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
};


// Danh sách tất cả danh mục
// controllers/categoryController.js

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    const formatted = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      parent: cat.parent ? cat.parent.toString() : null,
      status: cat.status,
      description: cat.description,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục:', error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật danh mục
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, parent } = req.body; // 👈 thêm parent
    const slug = slugify(name, { lower: true, strict: true });

    const updated = await Category.findByIdAndUpdate(
      id,
      {
        name,
        description,
        image,
        slug,
        parent: parent || null, // 👈 gán lại parent khi cập nhật
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
};


// Xóa danh mục
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
};
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh mục' });
  }
};
