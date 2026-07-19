import { beforeEach } from "node:test";
import { describe, it, expect, vi } from "vitest";
import { prisma } from "../lib/prisma";
import { findCategoryIdsBySlug } from "../utils/category-utils";
import { NotFoundError } from "../errors/custom-errors";
import { mockCategoryList } from "../tests/mockData";

vi.mock("../lib/prisma", () => ({
  prisma: {
    category: {
      findFirst: vi.fn(),
    },
  },
}));
describe("findCategoryIdsBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSlug = "women";

  it("should throw NotFoundError on category not found", async () => {
    const mockCategory = null;

    vi.mocked(prisma.category.findFirst).mockResolvedValue(mockCategory);

    try {
      await findCategoryIdsBySlug(mockSlug);

      expect.fail(
        "Expected findCategoryIdsBySlug to throw error, but it succeeded",
      );
    } catch (error: any) {
      expect(error).instanceOf(NotFoundError);
      expect(error.message).toBe("Category not found");
    }
  });

  it("should return category id and proper children ids", async () => {
    const mockCategory = mockCategoryList[0] as any;
    vi.mocked(prisma.category.findFirst).mockResolvedValue(mockCategory);

    const result = await findCategoryIdsBySlug(mockSlug);

    expect(result).toEqual([
      mockCategory.id,
      mockCategory.children[0]?.id,
      mockCategory.children[1]?.id,
      mockCategory.children[2]?.id,
    ]);
  });
});
