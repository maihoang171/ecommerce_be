import { beforeEach, describe, expect, it, vi } from "vitest";
import { addToCartController } from "./cart-controllers";
import { BadRequestError } from "../../errors/custom-errors";
import { addToCartService } from "../../services/cart-services";
import { mockCart } from "../../tests/mockData";
import { sendSuccess } from "../../utils/response-utils";

vi.mock("../../services/cart-services", () => ({
  addToCartService: vi.fn(),
}));

vi.mock("../../utils/response-utils", () => ({
  sendSuccess: vi.fn(),
}));

describe("addToCartController", () => {
  let mockReq: any;
  const mockRes = {} as any;
  const mockNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      body: {
        userId: 1,
        productId: 1,
        color: "Red",
        size: "S",
      },
    } as any;
  });

  it("should throw error when user id is not a number", async () => {
    mockReq = {
      ...mockReq,
      body: { ...mockReq.body, userId: "abc" },
    };

    try {
      await addToCartController(mockReq, mockRes, mockNext);
    } catch (error: any) {
      expect(error).instanceOf(BadRequestError);
      expect(error.message).toBe("User id or product id must be valid number");
    }
  });

  it("should throw error when product id is not a number", async () => {
    mockReq = {
      ...mockReq,
      body: { ...mockReq.body, productId: "abc" },
    };

    try {
      await addToCartController(mockReq, mockRes, mockNext);
    } catch (error: any) {
      expect(error).instanceOf(BadRequestError);
      expect(error.message).toBe("User id or product id must be valid number");
    }
  });

  it("should call next when an error occurred", async () => {
    const mockErr = new Error("Something went wrong");

    vi.mocked(addToCartService).mockRejectedValue(mockErr);

    try {
      await addToCartController(mockReq, mockRes, mockNext);
    } catch (error: any) {
      expect(error.message).toBe("Something went wrong");
      expect(mockNext).toHaveBeenCalled;
    }
  });

  it("should return status code 201 and cart on success", async () => {
    vi.mocked(addToCartService).mockResolvedValue(mockCart);
    await addToCartController(mockReq, mockRes, mockNext);

    expect(sendSuccess).toHaveBeenCalledWith(mockRes, 201, mockCart);
  });
});
