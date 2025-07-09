import express from 'express';
import { createPost, getPosts, deletePost,getPostById, updatePost } from '../controllers/postController.js';

const postRouter = express.Router();

postRouter.post('/', createPost);
postRouter.get('/', getPosts);
postRouter.get('/:id', getPostById);
postRouter.delete('/:id', deletePost);
postRouter.put('/:id', updatePost);
export default postRouter;
