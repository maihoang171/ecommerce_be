import { prisma } from "../lib/prisma";
import { NotFoundError } from "../utils/custom-errors-utils";

export const findCategoryIdsBySlug = async (slug: string) => {
  const category = await prisma.category.findFirst({
    where: { slug },
    select: {
      id: true,
      children: {
        select: { id: true },
      },
      
    },
  });

  if (!category) throw new NotFoundError("Category not found");

  return [category.id, ...category.children.map((c: { id: number }) => c.id)];
};
