import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPaymentIntent, handleWebhook } from "../controller/payments.controller.js";
const router = Router();
//router.use(protectRoute);

router.post("/create-intent",protectRoute,createPaymentIntent);
router.post("/webhook",handleWebhook)




export default router;