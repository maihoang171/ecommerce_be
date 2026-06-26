import { describe, vi, expect, it, beforeEach } from "vitest";
import { findCategoryListService } from "../../services/category-services";
import { findProductListByCategorySlugService } from "../../services/product-services";
import {
  findCategoryListController,
  findProductListByCategorySlugController,
} from "./category-controllers";
import { sendSuccess } from "../../utils/response-utils";
import { BadRequestError } from "../../utils/custom-errors-utils";
import {
  mockCategoryListResponse,
  mockProductListResponse,
} from "../../tests/mockResponse";

vi.mock("../../services/category-services.ts", () => ({
  findCategoryListService: vi.fn(),
}));

vi.mock("../../services/product-services.ts", () => ({
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
    vi.mocked(findCategoryListService).mockResolvedValue(
      mockCategoryListResponse as any,
    );

    await findCategoryListController(mockReq as any, mockRes as any, mockNext);

    expect(findCategoryListService).toHaveBeenCalled();
    expect(sendSuccess).toHaveBeenCalledWith(
      mockReq,
      200,
      mockCategoryListResponse,
    );
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
