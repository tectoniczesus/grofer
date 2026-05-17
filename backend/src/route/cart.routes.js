import  {Router} from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCart,addToCart,updateCart,removeFromCart,clearCart } from "../controller/cart.controller.js";
const router = Router();
router.use(protectRoute);

router.get("/",getCart);
router.post("/",addToCart);
router.put("/:productId",updateCart);
router.delete("/:productId",removeFromCart);
router.delete("/",clearCart);
export default router;