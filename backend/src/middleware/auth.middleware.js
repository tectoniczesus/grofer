import {requireAuth} from "@clerk/express";
import {User} from "../models/user.models.js";
import {ENV} from "../config/env.js";
export const proctectRoute = [
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