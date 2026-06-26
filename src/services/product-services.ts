import { prisma } from "../../src/lib/prisma";
import { findCategoryIdsBySlug } from "../helpers/category-helpers";

export const findProductListByCategorySlugService = async (slug: string) => {
  const categoryIds = await findCategoryIdsBySlug(slug);

  return await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: { in: categoryIds },
    },

    include: {
      images: {
        select: {
          id: true,
          color: true,
          imageUrl: true,
          isPrimary: true,
        },
      },
      variants: true,
    },
  });
};
