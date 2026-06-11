import express from "express";
import { findCategoryListController } from "../controllers/category/category-controllers";

const categoryRouter = express.Router();

categoryRouter.get("", findCategoryListController);

export default categoryRouter;
