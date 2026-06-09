import express from "express";
import {
  registerController,
  loginController,
  getMeController,
  refreshTokenController,
  logoutController
} from "../controllers/user/user-controllers";
import { authenticateJwt } from "../middlewares/authenticateJwt";

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/me", authenticateJwt, getMeController);
authRouter.get("/refresh-token", refreshTokenController);
authRouter.post("/logout", logoutController);

export default authRouter;
