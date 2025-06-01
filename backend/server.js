import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
app.use(express.json())

// connect to DB
await connectDB();

// middlewares
app.use(cors())
app.use(clerkMiddleware())

// routes
app.get('/', (req, res) => res.send("Api Working"));
app.post('/clerk', clerkWebhooks)
app.post('/stripe', express.raw({type:'application/json'}) ,stripeWebhooks)

app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/user', userRouter);

// Port 
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})