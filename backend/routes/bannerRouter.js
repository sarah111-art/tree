import express from 'express';
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js';

const bannerRouter = express.Router();

bannerRouter.get('/', getAllBanners);
bannerRouter.post('/', createBanner);
bannerRouter.put('/:id', updateBanner);
bannerRouter.delete('/:id', deleteBanner);

export default bannerRouter;
