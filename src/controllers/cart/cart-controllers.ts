import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/response-utils";
import { addToCartService } from "../../services/cart-services";
import { BadRequestError } from "../../errors/custom-errors";

export const addToCartController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, productId, color, size } = req.body;

    const numericUserId = Number(userId);
    const numericProductId = Number(productId);

    if (isNaN(numericUserId) || isNaN(numericProductId)) {
      throw new BadRequestError("User id or product id must be valid number");
    }

    const cart = await addToCartService(
      numericUserId,
      numericProductId,
      color,
      size,
    );

    return sendSuccess(res, 201, cart);
  } catch (error) {
    next(error);
  }
};
