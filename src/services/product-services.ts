import { prisma } from "../../src/lib/prisma";
import { NotFoundError } from "../errors/custom-errors";

export const findProductService = async (productId: number) => {
  return await prisma.product.findFirst({
    where: {
      id: productId,
    },
    include: {
      images: true,
      variants: true,
    },
  });
};

export const findProductVariantService = async (
  productId: number,
  color: string,
  size: string,
) => {
  const product = await findProductService(productId);
  if (!product) {
    throw new NotFoundError("product is not found");
  }

  const variant = product?.variants.find(
    (v: any) => v.color === color && v.size === size,
  );
  if (!variant) {
    throw new NotFoundError("color and size is not found or invalid");
  }

  return variant;
};

export const findRelatedProductsService = async (productId: number) => {
  const product = await findProductService(productId);
  if (!product) {
    throw new NotFoundError("product is not found");
  }

  return await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: productId } },
    include: {
      images: true,
      variants: true,
    },
  });
};
