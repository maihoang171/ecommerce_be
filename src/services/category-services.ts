import { prisma } from "../../src/lib/prisma";
import { findCategoryIdsBySlug } from "../helpers/category-helpers";

export const findCategoryListService = async () => {
  return await prisma.category.findMany({
    where: {
      parentId: null,
    },
    include: {
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
        },
        orderBy: { name: "asc" },
      },
      campaigns: {
        select: {
          id: true,
          title: true,
          subTitle: true,
          imageUrl: true,
          linkUrl: true,
        },
      },
    },
  });
};

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
      variants: true
    },
  });
};
