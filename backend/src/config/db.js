import mongoose from "mongoose";
import {ENV} from "./env.js"

export const connectDB = async ()=>{
    try{
     const conn = await mongoose.connect(ENV.DATABASE_URL);
     console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    }catch(error){
        console.error("❌ MongoDB connection error:");
        process.exit(1);

    }
}