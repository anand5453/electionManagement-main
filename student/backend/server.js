import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import connectToMongoDB from './db/connectToDB.js'
import electionRoutes from './routes/electionRoutes.js'
import votingRoutes from './routes/votingRoutes.js'
import passwordRoutes from './routes/passwordRoutes.js'

dotenv.config()
const app=express();
const PORT=process.env.port || 5000
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
      origin: "http://localhost:5174", // Replace with your frontend origin
      credentials: true, // Allow credentials (cookies)
    }),

  );
app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.use('/auth',authRoutes)
app.use("/election",electionRoutes)
app.use('/vote',votingRoutes)
app.use('/password',passwordRoutes)

app.listen(PORT,'0.0.0.0',async ()=>{
     connectToMongoDB()
    console.log("server running")})