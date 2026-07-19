import express from "express";
import { addToCartController } from "../controllers/cart/cart-controllers";
import { authenticateJwt } from "../middlewares/authenticate-jwt";
const cartRouter = express.Router();

cartRouter.post("", authenticateJwt, addToCartController);

export default cartRouter;
