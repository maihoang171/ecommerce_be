import express from "express";
import authRouter from "../router/auth-routes";
import categoryRouter from "./category-routes";
import campaignRouter from "./campaign-routes";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/category", categoryRouter);

router.use("/campaign", campaignRouter)

export default router;
