import express from "express";
import { registerController } from "../controllers/user/user-controllers";
const authRouter = express.Router();

authRouter.post("/register", registerController);

export default authRouter;
