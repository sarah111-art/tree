import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import userRouter from './routes/userRouter.js'
import adminRouter from './routes/adminRouter.js'
import categoryRoutes from './routes/categoryRouter.js'
import uploadRoute from './routes/uploadRoute.js';
import productRouter from './routes/productRouter.js'
import orderRouter from './routes/orderRouter.js'
import bankRouter from './routes/bankRouter.js'
import bannerRouter from './routes/bannerRouter.js'
import footerRouter from './routes/footerRouter.js'
import postRouter from './routes/postRouter.js'
import contactRouter from './routes/contactRouter.js'
import qrRouter from './routes/qrRouter.js'
import momoRouter from './routes/momoRouter.js'
import vnpayRouter from './routes/vnpayRouter.js'
import activityRouter from './routes/activityLogRouter.js'
import searchRouter from './routes/searchRouter.js'
import emailRouter from './routes/emailRouter.js'
import cassoRouter from './routes/cassoRouter.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

// Routes

//manager
app.use('/api/users', userRouter)
app.use('/api', adminRouter)
//category
app.use('/api/categories', categoryRoutes);
//uploadimg
app.use('/api/upload', uploadRoute);               // Đảm bảo có dòng này
app.use('/uploads', express.static('uploads'));// Connect DB and start server
//product
app.use('/api/products', productRouter);
//order
app.use('/api/orders', orderRouter);
//bank
app.use('/api/bank', bankRouter);
//banner
app.use('/api/banners',bannerRouter);
//footer
app.use('/api/footers', footerRouter);
//post
app.use('/api/posts', postRouter);
//contact
app.use('/api/contacts', contactRouter);
//qr
app.use('/api/qr', qrRouter);
//momo payment
app.use('/api/momo', momoRouter);
//vnpay payment
app.use('/api/vnpay', vnpayRouter);
//ativity
app.use('/api', activityRouter);
//search
app.use('/api/search', searchRouter);
//email
app.use('/api/email', emailRouter);
//casso payment
app.use('/api/casso', cassoRouter);
// --- Socket.IO ---
const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})

io.on('connection', (socket) => {
  console.log('🔌 Admin connected:', socket.id)
  socket.on('disconnect', () => {
    console.log('🔌 Admin disconnected:', socket.id)
  })
})

// Make io available in routes
app.set('io', io)

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`))
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err))
