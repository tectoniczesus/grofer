import {Router} from "express";
import { createProduct } from "../controller/admin.controller.js";
const router = Router();
router.post("/products",protectRoute, adminOnly,createProduct);
export default router;