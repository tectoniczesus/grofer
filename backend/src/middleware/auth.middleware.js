import {requireAuth} from "@clerk/express";
import User from "../models/user.models.js";
import {ENV} from "../config/env.js";
export const protectRoute = [
    requireAuth(),
    async(req,res,next)=>{
  try {
    const clerkID = req.auth().userId;
    if(!clerkID) return res.status(401).json({message:"Unauthorized-token invalid"});
    const user = await User.findOne({clerkId});
    if(!user) return res.status(404).json({message:"User not found"});
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware",error);
    res.status(500).json({message:"Internal server error"});
  }
    }
]
export const adminOnly = (req,res,next)=>{
  if(!req.user) return res.status(401).json({message:"Unauthorized-user not found"});
  if(req.user.role !== ENV.ADMIN_EMAIL){
    return res.status(403).json({message:"Forbidden-access denied"});
  }
  next();
}
export const upload = multer({
  storage,
  fileFilter,
  limits:{fileSize:5*1024*1024} //5MB
})