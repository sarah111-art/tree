import express from 'express'
import { register, login, getAllUsers } from '../controllers/userController.js'
import { authenticate } from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/', authenticate, getAllUsers)

export default userRouter
