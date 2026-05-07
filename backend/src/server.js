import express from "express";
import path from "path";
import { clerkMiddleware } from '@clerk/express'
import { connectDB } from "./config/db.js";
const app = express();
import {ENV} from "./config/env.js";
const __dirname = path.resolve();
app.use(clerkMiddleware());
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "server is running fine" });
});

// making ready for the deployment
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../admin/dist")));


    app.get("/{*any}", (req,res)=>{
        res.sendFile(path.join(__dirname, "../admin","dist","index.html"));
    })
}

app.listen(3000, "0.0.0.0",() => {
  console.log("server is running on port 3000");
  connectDB();
});
