import express from "express";
import authRouter from "../router/auth-routes";
import categoryRouter from "./category-routes";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/category", categoryRouter);

export default router;
