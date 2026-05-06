import express from "express";
import path from "path";
const app = express();
import {ENV} from "./config/env.js";
const __dirname = path.resolve();
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

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
