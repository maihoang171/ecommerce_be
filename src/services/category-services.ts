import { prisma } from "../../src/lib/prisma";

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
    },
  });
};
