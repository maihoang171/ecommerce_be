import { beforeEach } from "node:test";
import { describe, vi, expect, it } from "vitest";
import { findCategoryListService } from "../../services/category-services";
import { findCategoryListController } from "./category-controllers";
import { sendSuccess } from "../../utils/response-utils";

vi.mock("../../services/category-services.ts", () => ({
  findCategoryListService: vi.fn(),
}));

vi.mock("../../utils/response-utils.ts", () => ({
  sendSuccess: vi.fn(),
}));

describe("find category list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockReq = {};
  const mockRes = {};
  const mockNext = vi.fn();

  it("should return status code 200 and category data on success", async () => {
    const mockCategoryRes = {
      status: true,
      data: [
        {
          id: 1,
          name: "Men",
          slug: "men",
          imageUrl:
            "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=600&auto=format&fit=crop",
          parentId: null,
          children: [
            {
              id: 4,
              name: "Jackets & Coats",
              slug: "men-jackets",
              imageUrl:
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=500&auto=format&fit=crop",
            },
          ],
        },
        {
          id: 6,
          name: "Women",
          slug: "women",
          imageUrl:
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
          parentId: null,
          children: [
            {
              id: 8,
              name: "Blouses & Tops",
              slug: "women-tops",
              imageUrl:
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop",
            },
          ],
        },
      ],
    };

    vi.mocked(findCategoryListService).mockResolvedValue(
      mockCategoryRes as any,
    );

    await findCategoryListController(mockReq as any, mockRes as any, mockNext);

    expect(findCategoryListService).toHaveBeenCalled();
    expect(sendSuccess).toHaveBeenCalledWith(mockReq, 200, mockCategoryRes);
  });

  it("should call next when error occurred", async () => {
    const mockErr = new Error("Something went wrong");

    vi.mocked(findCategoryListService).mockRejectedValue(mockErr);

    await findCategoryListController(mockReq as any, mockRes as any, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockErr);
  });
});
