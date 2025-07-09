import Banner from "../models/bannerModel.js";

// Lấy danh sách
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tải banner", error });
  }
};

// Thêm mới
export const createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Thêm banner thất bại", error });
  }
};

// Cập nhật
export const updateBanner = async (req, res) => {
  try {
    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Cập nhật banner thất bại", error });
  }
};

// Xoá
export const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xoá banner" });
  } catch (error) {
    res.status(500).json({ message: "Xoá banner thất bại", error });
  }
};
