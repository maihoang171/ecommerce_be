import express from "express";
import {
  registerController,
  loginController,
  getMeController,
  logoutController,
} from "../controllers/user/user-controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/me", authMiddleware, getMeController);
authRouter.post("/logout", logoutController);
export default authRouter;
