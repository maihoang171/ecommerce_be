import type {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";
import { BadRequestError, NotFoundError } from "../../errors/custom-errors";
import { sendSuccess } from "../../utils/response-utils";
import {
  findProductService,
  findRelatedProductsService,
} from "../../services/product-services";

export const findProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const numericId = Number(id);

    if (isNaN(numericId)) {
      throw new BadRequestError("Product id must be valid number");
    }

    const product = await findProductService(numericId);

    const relatedProducts = await findRelatedProductsService(product.id);

    sendSuccess(res, 200, { ...product, relatedProducts });
  } catch (error) {
    next(error);
  }
};
