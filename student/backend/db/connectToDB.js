import mongoose from 'mongoose'

const connectToMongoDB =async()=>{
    try{
        console.log(process.env.MONGO_URI)
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to mongodb")
    }
    catch(error){
        console.log("Failed connecting to mongodb",error)
    }
}
export default connectToMongoDB