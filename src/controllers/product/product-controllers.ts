import type {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";
import { BadRequestError } from "../../errors/custom-errors";
import { sendSuccess } from "../../utils/response-utils";
import { findProductService } from "../../services/product-services";

export const findProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { categoryId } = req.query;

    if (!categoryId) {
      throw new BadRequestError("Missing category id");
    }

    const numericId = Number(id);
    const numericCategoryId = Number(categoryId);

    if (isNaN(numericCategoryId) || isNaN(numericId)) {
      throw new BadRequestError(
        "Product Id and category id must be valid number",
      );
    }

    const product = await findProductService(numericId, numericCategoryId);

    sendSuccess(res, 200, product);
  } catch (error) {
    next(error);
  }
};
