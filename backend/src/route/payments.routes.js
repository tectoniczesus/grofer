import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPaymentIntent, handleWebhook } from "../controller/payments.controller.js";
const router = Router();
//router.use(protectRoute);

router.post("/create-intent",protectRoute,createPaymentIntent);
router.post("/webhook",handleWebhook)

router.post("/webhook", (req, res, next) => {
    console.log("WEBHOOK ROUTE HIT");
    console.log("URL:", req.originalUrl);
    next();
}, handleWebhook);




export default router;