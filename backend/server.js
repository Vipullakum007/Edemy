import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js';
import { clerkWebhooks } from './controllers/webhooks.js';

const app = express();
app.use(express.json())

await connectDB();

// middlewares
app.use(cors())

// routes
app.get('/', (req, res) => res.send("Api Working"));
app.post('/clerk' , clerkWebhooks)


// Port 
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})