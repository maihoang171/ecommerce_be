import express from "express";
import {
  findCategoryListController,
  findProductListByCategorySlugController,
} from "../controllers/category/category-controllers";

const categoryRouter = express.Router();

categoryRouter.get("", findCategoryListController);

categoryRouter.get(
  "/:parentSlug/:childSlug",
  findProductListByCategorySlugController,
);

categoryRouter.get("/:parentSlug", findProductListByCategorySlugController);

export default categoryRouter;
