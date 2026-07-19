import { Prisma } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../errors/custom-errors";
import { prisma } from "../lib/prisma";
import { findUserByIdService } from "./auth-services";
import { findProductVariantService } from "./product-services";

export const findCartService = async (userId: number) => {
  return await prisma.cart.findFirst({
    where: {
      userId,
    },
  });
};

export const createCartService = async (userId: number) => {
  return await prisma.cart.create({
    data: {
      userId,
    },
  });
};

export const findItemInCart = async (
  tx: Prisma.TransactionClient,
  productVariantId: number,
  cartId: number,
) => {
  return await tx.cartItem.findFirst({
    where: {
      productVariantId,
      cartId,
    },
  });
};

export const addToCartService = async (
  userId: number,
  productId: number,
  color: string,
  size: string,
) => {
  const user = await findUserByIdService(userId);
  if (!user) {
    throw new NotFoundError("user is not found");
  }

  const variant = await findProductVariantService(productId, color, size);
  if (variant.stockQuantity === 0) {
    throw new BadRequestError("Requested quantity exceeds available stock.");
  }

  let cart = await findCartService(userId);

  if (!cart) {
    cart = await createCartService(userId);
  }

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const itemInCart = await findItemInCart(tx, variant.id, cart.id);
    if (itemInCart) {
      if (itemInCart.quantity + 1 > variant.stockQuantity) {
        throw new BadRequestError(
          "Requested quantity exceeds available stock.",
        );
      }
      await tx.cartItem.update({
        where: {
          id: itemInCart.id,
        },
        data: {
          quantity: itemInCart.quantity + 1,
        },
      });
    } else {
      await tx.cartItem.create({
        data: {
          productVariantId: variant.id,
          quantity: 1,
          cartId: cart.id,
        },
      });
    }

    return await tx.cart.findUnique({
      where: { id: cart.id },
      select: {
        id: true,
        userId: true,
        items: {
          select: {
            id: true,
            quantity: true,
            productVariant: true,
          },
        },
      },
    });
  });
};
