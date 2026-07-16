import express from "express"
import { findProductController } from "../controllers/product/product-controllers"

const productRouter = express.Router()

productRouter.get("/:id", findProductController)

export default productRouter