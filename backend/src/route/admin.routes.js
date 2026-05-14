import { Router } from "express";
import { createProduct,getAllProducts,updateProduct,getAllOrders,updateOrderStatus } from "../controller/admin.controller.js";
import { adminOnly, protectRoute, upload } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute, adminOnly);

router.post("/products", upload.array("images",3),createProduct);
router.get("/products", getAllProducts);
router.put("/products/:id",upload.array("images",3), updateProduct);


router.get("/orders",getAllOrders);
router.patch("/orders/:orderId/status",updateOrderStatus);

export default router;
