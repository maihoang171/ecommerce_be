import type {
  Response,
  Request,
  NextFunction,
} from "express-serve-static-core";
import { findCategoryListService } from "../../services/category-services";
import { sendSuccess } from "../../utils/response-utils";

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
