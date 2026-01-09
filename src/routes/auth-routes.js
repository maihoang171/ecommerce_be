import express from "express";
import {
  registerController,
  loginController,
  getMeController,
  logoutController,
  createAddressController,
} from "../controllers/user/user-controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/me", authMiddleware, getMeController);
authRouter.post("/logout", logoutController);
authRouter.post("/address", authMiddleware, createAddressController);
export default authRouter;
