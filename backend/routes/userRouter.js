import express from 'express'
import { register, login, getAllUsers, getUserById } from '../controllers/userController.js'
import { authenticate } from '../middlewares/auth.js'

const userRouter = express.Router()
userRouter.get('/', authenticate, getAllUsers)
userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/:id', authenticate, getUserById)

export default userRouter
