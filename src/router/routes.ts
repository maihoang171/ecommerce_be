import express from "express";
import authRouter from "../router/auth-routes";

const router = express.Router();

router.use("/auth", authRouter);

export default router;
