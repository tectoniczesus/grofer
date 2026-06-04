import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPaymentIntent } from "../controller/payments.controller.js";
const router = Router();
router.use(protectRoute);

router.post("/create-intent",createPaymentIntent);




export default router;