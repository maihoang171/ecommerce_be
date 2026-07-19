import express from "express";
import authRouter from "../router/auth-routes";
import categoryRouter from "./category-routes";
import campaignRouter from "./campaign-routes";
import productRouter from "./product-routes";
import cartRouter from "./cart-routes";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/category", categoryRouter);

router.use("/campaign", campaignRouter);

router.use("/product", productRouter);

router.use("/cart", cartRouter);

export default router;
