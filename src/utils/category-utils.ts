import { CategoryType } from "@prisma/client";

export const CategorySizes: Record<CategoryType, string[]> = {
  TOP: ["S", "M", "L", "XL", "XXL"],
  BOTTOM: ["28", "29", "30", "31", "32"],
};
