import { describe, vi, expect, it } from "vitest";
import { findCategoryListService } from "./category-services";
import { findProductListByCategorySlugService } from "./product-services";
import { prisma } from "../lib/prisma";
import { findCategoryIdsBySlug } from "../helpers/category-helpers";

vi.mock("../lib/prisma", () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    product: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("../helpers/category-helpers", () => ({
  findCategoryIdsBySlug: vi.fn(),
}));

describe("findCategoryListService", () => {
  it("should return parent categories on success", async () => {
    const mockCategories = [
      {
        id: 1,
        name: "Woman",
        slug: "woman",
        parentId: null,
        children: [],
        campaigns: [],
      },
    ];

    vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories);

    const result = await findCategoryListService();

    expect(prisma.category.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockCategories);
  });
});

describe("findProductListByCategorySlugService", () => {
  it("should return product list on success", async () => {
    const mockSlug = "women";
    const mockCategoryIds = [1, 2, 3];
    vi.mocked(findCategoryIdsBySlug).mockResolvedValue(mockCategoryIds);

    const mockProducts = [
      {
        id: 1,
        name: "product 1",
        isActive: true,
        images: [
          {
            id: 1,
            imageUrl: "mockImageUrl",
          },
        ],
      },
      {
        id: 2,
        name: "product 2",
        isActive: true,
        images: [
          {
            id: 1,
            imageUrl: "mockImageUrl1",
          },
          {
            id: 2,
            imageUrl: "mockImageUrl2",
          },
        ],
      },
    ];

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);

    const result = await findProductListByCategorySlugService(mockSlug);

    expect(result).toEqual(mockProducts);
    expect(prisma.product.findMany).toHaveBeenCalledTimes(1);
  });
});
