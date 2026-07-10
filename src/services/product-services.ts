import { prisma } from "../../src/lib/prisma";

export const findProductService = async (productId: number, categoryId: number) => {
  return await prisma.product.findFirst({
    where: { 
      id: productId,
      categoryId
     },
     include: {
      images: true,
      variants: true,
     }
  });
};
