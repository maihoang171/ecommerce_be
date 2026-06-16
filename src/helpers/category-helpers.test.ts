import { beforeEach } from "node:test";
import { describe, it, expect, vi } from "vitest";
import { prisma } from "../lib/prisma";
import { findCategoryIdsBySlug } from "./category-helpers";
import { NotFoundError } from "../utils/custom-errors-utils";

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

  const mockSlug = "mockSlug";

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
    const mockCategory = {
      id: 1,
      slug: mockSlug,
      children: [
        {
          id: 2,
        },
        {
          id: 3,
        },
      ],
    };
    vi.mocked(prisma.category.findFirst).mockResolvedValue(mockCategory);

    const result = await findCategoryIdsBySlug(mockSlug);

    expect(result).toEqual([
      mockCategory.id,
      mockCategory.children[0]?.id,
      mockCategory.children[1]?.id,
    ]);
  });
});
