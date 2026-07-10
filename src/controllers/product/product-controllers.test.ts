import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { BadRequestError } from "../../errors/custom-errors";
import { findProductController } from "./product-controllers";
import { findProductService } from "../../services/product-services";
import { sendSuccess } from "../../utils/response-utils";
import { mockProductList } from "../../tests/mockData";

vi.mock("../../services/product-services", () => ({
  findProductService: vi.fn(),
}));

vi.mock("../../utils/response-utils", () => ({
  sendSuccess: vi.fn(),
}));

describe("findProductController", () => {
  let mockReq: any;
  const mockRes = {} as any;
  const mockNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      params: {
        id: 1,
      },
      query: {
        categoryId: 1,
      },
    };
  });

  it("should throw bad request error if categoryId is missing", async () => {
    mockReq = {
      ...mockReq,
      query: {
        categoryId: null,
      },
    };

    await findProductController(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
  });

  it("should call next with bad request error if categoryId is not a number", async () => {
    mockReq = {
      ...mockReq,
      query: {
        categoryId: "string",
      },
    };

    await findProductController(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
  });

  it("should call next with bad request error if id is not a number", async () => {
    mockReq = {
      ...mockReq,
      params: {
        id: "string",
      },
    };

    await findProductController(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
  });

  it("should call next if errors occurs", async () => {
    const mockErr = new Error("Something went wrong");

    vi.mocked(findProductService).mockRejectedValue(mockErr);

    await findProductController(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockErr);
  });

  it("should return status code 200 and product on success", async () => {
    const mockProduct = mockProductList[0];

    vi.mocked(findProductService).mockResolvedValue(mockProduct);

    await findProductController(mockReq, mockRes, mockNext);

    expect(sendSuccess).toHaveBeenCalledWith(mockRes, 200, mockProduct);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
