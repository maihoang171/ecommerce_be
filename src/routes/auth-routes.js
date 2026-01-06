import express from "express";
import {
  registerUserController,
  loginUserController,
} from "../controllers/user/user-controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerUserController);
authRouter.post("/login", loginUserController);

export default authRouter;
