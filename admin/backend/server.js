import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectToMongoDB from './db/connectToDB.js';
import authRoutes from './routes/authRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import electionRoutes from './routes/electionRoutes.js';

dotenv.config();
console.log('MONGO_URI =', process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT ;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);


app.get('/health', (_req,res)=>res.json({ok:true}));

app.use('/auth', authRoutes);
app.use('/students', accountRoutes);
app.use('/election', electionRoutes);

app.listen(PORT, '0.0.0.0', async () => {
  await connectToMongoDB();
  console.log('server running on', PORT);
});
