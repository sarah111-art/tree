import Post from '../models/postModel.js';
import slugify from 'slugify';
import { logActivity } from '../utils/LogActivity.js';

// Tạo bài viết mới
export const createPost = async (req, res) => {
  try {
    const { title, content, image, status, category, metaTitle, metaDescription, metaKeywords } = req.body;
    const slug = slugify(title, { lower: true, strict: true });

    const newPost = await Post.create({
      title,
      slug,
      content,
      image,
      status,
      category,
      metaTitle,
      metaDescription,
      metaKeywords: metaKeywords?.split(',').map((kw) => kw.trim()),
    });

    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id,
        action: 'Thêm bài viết mới',
        targetType: 'Post',
        targetId: newPost._id,
        metadata: { title: newPost.title }
      });
    }

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo bài viết', err });
  }
};

// Lấy danh sách bài viết
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy bài viết', err });
  }
};

// Xoá bài viết
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    
    await Post.findByIdAndDelete(req.params.id);
    
    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id,
        action: 'Xóa bài viết',
        targetType: 'Post',
        targetId: req.params.id,
        metadata: { title: post.title }
      });
    }
    
    res.json({ message: 'Đã xoá bài viết' });
  } catch (err) {
    res.status(500).json({ message: 'Xoá thất bại', err });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // 👈 ID từ URL
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
export const updatePost = async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Post not found' });
    
    // Log activity for staff
    if (req.user && (req.user.role === 'staff' || req.user.role === 'manager')) {
      await logActivity({
        staffId: req.user._id,
        action: 'Cập nhật bài viết',
        targetType: 'Post',
        targetId: updated._id,
        metadata: { title: updated.title, changes: Object.keys(req.body) }
      });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật bài viết', error: err.message });
  }
};