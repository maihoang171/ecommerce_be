import express from "express";
import { registerUserController } from "../controllers/user/user-controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerUserController);

export default authRouter;
