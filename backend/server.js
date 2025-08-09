import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRouter from './routes/userRouter.js'
import adminRouter from './routes/adminRouter.js'
import categoryRoutes from './routes/categoryRouter.js'
import uploadRoute from './routes/uploadRoute.js';
import productRouter from './routes/productRouter.js'
import orderRouter from './routes/orderRouter.js'
import bannerRouter from './routes/bannerRouter.js'
import postRouter from './routes/postRouter.js'
import contactRouter from './routes/contactRouter.js'
import qrRouter from './routes/qrRouter.js'
import activityRouter from './routes/activityLogRouter.js'
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
//banner
app.use('/api/banners',bannerRouter);
//post
app.use('/api/posts', postRouter);
//contact
app.use('/api/contacts', contactRouter);
//qr
app.use('/api/qr', qrRouter);
//ativity
app.use('/api', activityRouter);  
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`))
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err))
