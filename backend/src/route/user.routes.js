import {Router} from "express";
import {addAddress ,deleteAddress,updateAddress,getAddress,addToWishlist,removeFromWishlist,getWishlist} from "../controller/user.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";
const router = Router();
router.use(protectRoute);
router.post("/address",addAddress);
router.get("/address",getAddress);
router.put("/address",updateAddress);
router.delete("/address",deleteAddress);


router.post("/wishlist",addToWishlist);
router.delete("/wishlist/:productId",removeFromWishlist);
router.get("/wishlist",getWishlist);

export default router;