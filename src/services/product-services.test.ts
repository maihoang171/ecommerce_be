import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockProductList } from "../tests/mockData";
import { prisma } from "../lib/prisma";
import {
  findProductService,
  findProductVariantService,
  findRelatedProductsService,
} from "./product-services";
import { NotFoundError } from "../errors/custom-errors";

vi.mock("../lib/prisma", () => ({
  prisma: {
    product: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe("product service", () => {
  const mockParams = {
    productId: 1,
    color: "Red",
    size: "M",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findProductService", () => {
    it("should return correct product on success", async () => {
      const mockProduct = mockProductList[0];

      vi.mocked(prisma.product.findFirst).mockResolvedValue(mockProduct);

      const res = await findProductService(mockParams.productId);

      expect(res).toBe(mockProduct);
    });
  });

  describe("findProductVariantService", () => {
    it("should throw error when product is not found", async () => {
      vi.mocked(prisma.product.findFirst).mockResolvedValue(null);

      try {
        await findProductVariantService(
          mockParams.productId,
          mockParams.color,
          mockParams.size,
        );
      } catch (error: any) {
        expect(error).instanceOf(NotFoundError);

        expect(error.message).toBe("product is not found");
      }
    });

    it("should throw error when color is not found or invalid", async () => {
      const product = mockProductList[0];
      vi.mocked(prisma.product.findFirst).mockResolvedValue(product);

      try {
        await findProductVariantService(
          mockParams.productId,
          "invalidColor",
          "invalidSize",
        );
      } catch (error: any) {
        expect(error).instanceOf(NotFoundError);

        expect(error.message).toBe("color and size is not found or invalid");
      }
    });

    it("should return product variant on success", async () => {
      const product = mockProductList[0];
      vi.mocked(prisma.product.findFirst).mockResolvedValue(product);

      const res = await findProductVariantService(
        mockParams.productId,
        mockParams.color,
        mockParams.size,
      );

      expect(res).toBe(product?.variants[1]);
    });
  });

  describe("findRelatedProductsService", () => {
    it("should throw error when product is not found", async () => {
      vi.mocked(prisma.product.findFirst).mockResolvedValue(null);

      try {
        await findRelatedProductsService(mockParams.productId);
      } catch (error: any) {
        expect(error).instanceOf(NotFoundError);

        expect(error.message).toBe("product is not found");
      }
    });

    it("should return related product list on success", async () => {
      const product = mockProductList[0];
      vi.mocked(prisma.product.findFirst).mockResolvedValue(product);

      vi.mocked(prisma.product.findMany).mockResolvedValue(mockProductList);

      const res = await findRelatedProductsService(mockParams.productId);

      expect(res).toBe(mockProductList);
    });
  });
});
