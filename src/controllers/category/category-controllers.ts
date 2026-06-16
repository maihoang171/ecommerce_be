import type {
  Response,
  Request,
  NextFunction,
} from "express-serve-static-core";
import {
  findCategoryListService,
  findProductListByCategorySlugService,
} from "../../services/category-services";
import { sendSuccess } from "../../utils/response-utils";
import { BadRequestError } from "../../utils/custom-errors-utils";

export const findCategoryListController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parentCategories = await findCategoryListService();

    sendSuccess(res, 200, parentCategories);
  } catch (error) {
    next(error);
  }
};

export const findProductListByCategorySlugController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { parentSlug, childSlug } = req.params;

    const targetSlug = childSlug || parentSlug;

    if (!targetSlug) {
      throw new BadRequestError("Missing category slug");
    }

    const productList = await findProductListByCategorySlugService(
      targetSlug as string,
    );

    sendSuccess(res, 200, productList);
  } catch (error) {
    next(error);
  }
};
