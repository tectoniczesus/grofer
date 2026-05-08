import express from "express";
import path from "path";
import { clerkMiddleware } from '@clerk/express'
import { connectDB } from "./config/db.js";
const app = express();
import {ENV} from "./config/env.js";
import { start } from "repl";
const __dirname = path.resolve();
app.use(clerkMiddleware());
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "server is running fine" });
})

// making ready for the deployment
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../admin/dist")));


    app.get("/{*any}", (req,res)=>{
        res.sendFile(path.join(__dirname, "../admin","dist","index.html"));
    })
}

const startServer = async()=>{
  await connectDB();
  app.listen(ENV.PORT,()=>{
    console.log(`server is running on port ${ENV.PORT}`);
  })
}

startServer();