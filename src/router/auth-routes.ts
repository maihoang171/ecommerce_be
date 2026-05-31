import express from "express";
import {
  registerController,
  loginController,
  getMeController,
} from "../controllers/user/user-controllers";
import { authenticateJwt } from "../middlewares/authenticateJwt";

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/me", authenticateJwt, getMeController);

export default authRouter;
