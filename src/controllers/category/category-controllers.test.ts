
import { describe, vi, expect, it, beforeEach } from "vitest";
import {
  findCategoryListService,
  findProductListByCategorySlugService,
} from "../../services/category-services";
import {
  findCategoryListController,
  findProductListByCategorySlugController,
} from "./category-controllers";
import { sendSuccess } from "../../utils/response-utils";
import { BadRequestError } from "../../utils/custom-errors-utils";

vi.mock("../../services/category-services.ts", () => ({
  findCategoryListService: vi.fn(),
  findProductListByCategorySlugService: vi.fn(),
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

describe("find productList", () => {
  let mockReq = {
    params: {},
  } as any;
  const mockRes = {} as any;
  const mockNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should pass error to next() on missing category slug", () => {
    findProductListByCategorySlugController(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));

    const errArg = mockNext.mock.calls[0]![0];
    expect(errArg.statusCode).toBe(400);
    expect(errArg.message).toBe("Missing category slug");
  });

  it("should pass error to next() on internal server error", async () => {
    mockReq = {
      ...mockReq,
      params: {
        parentSlug: "women",
        childSlug: "jeans",
      },
    } as any;

    const mockErr = new Error("Something went wrong");
    vi.mocked(findProductListByCategorySlugService).mockRejectedValue(mockErr);

    await findProductListByCategorySlugController(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockErr);
  });

  it("should return status code 200 and product list on success", async () => {
    mockReq = {
      ...mockReq,
      params: {
        parentSlug: "women",
        childSlug: "jeans",
      },
    } as any;

    const mockProductListResponse = [
      {
        id: 1,
        name: "Blouses & Tops Item #1",
        price: "448000",
        discountPrice: null,
        description:
          "This is a high-quality blouses & tops designed for everyday comfort, durability, and style.",
        categoryId: 2,
        isActive: true,
        discountStartAt: null,
        discountEndAt: null,
        images: [
          {
            id: 1,
            imageUrl:
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
            isPrimary: true,
          },
          {
            id: 2,
            imageUrl:
              "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
            isPrimary: false,
          },
        ],
      },
      {
        id: 2,
        name: "Blouses & Tops Item #2",
        price: "819000",
        discountPrice: null,
        description:
          "This is a high-quality blouses & tops designed for everyday comfort, durability, and style.",
        categoryId: 2,
        isActive: true,
        discountStartAt: null,
        discountEndAt: null,
        images: [
          {
            id: 3,
            imageUrl:
              "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
            isPrimary: true,
          },
          {
            id: 4,
            imageUrl:
              "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=500",
            isPrimary: false,
          },
        ],
      },
    ];

    vi.mocked(findProductListByCategorySlugService).mockResolvedValue(
      mockProductListResponse as any,
    );
    await findProductListByCategorySlugController(mockReq, mockRes, mockNext);

    expect(sendSuccess).toHaveBeenCalledWith(
      mockRes,
      200,
      mockProductListResponse,
    );
  });
});
