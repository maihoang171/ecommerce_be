import { afterEach, beforeEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { prisma } from "../lib/prisma";
import {
  mockCart,
  mockCartItems,
  mockProductList,
  mockUserData,
} from "../tests/mockData";
import {
  addToCartService,
  createCartService,
  findCartService,
  findItemInCart,
} from "./cart-services";
import { findUserByIdService } from "./auth-services";
import { BadRequestError, NotFoundError } from "../errors/custom-errors";
import { findProductVariantService } from "./product-services";

vi.mock("../lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    cart: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("../services/auth-services", () => ({
  findUserByIdService: vi.fn(),
}));

vi.mock("../services/product-services", () => ({
  findProductVariantService: vi.fn(),
}));

const mockTx = {
  cartItem: { findFirst: vi.fn(), update: vi.fn(), create: vi.fn() },
  cart: { findUnique: vi.fn() },
};

describe("cart services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findCartService", () => {
    it("should return correct cart on success", async () => {
      vi.mocked(prisma.cart.findFirst).mockResolvedValue(mockCart);

      const res = await findCartService(mockCart.userId);

      expect(res).toBe(mockCart);
    });
  });

  describe("createCartService", () => {
    it("should create new cart on success", async () => {
      vi.mocked(prisma.cart.create).mockResolvedValue(mockCart);

      const res = await createCartService(mockCart.userId);

      expect(res).toBe(mockCart);
    });
  });

  describe("findItemInCart", () => {
    it("should return correct item on success", async () => {
      const item = mockCartItems[0];

      vi.mocked(prisma.$transaction).mockImplementation(mockTx);

      vi.mocked(mockTx.cartItem.findFirst).mockResolvedValue(item);

      const res = await findItemInCart(
        mockTx as any,
        item!.productVariantId,
        item!.cartId,
      );

      expect(res).toEqual(mockCartItems[0]);
    });
  });

  describe("addToCartService", () => {
    const mockParams = {
      userId: mockCart.userId,
      productId: mockProductList[0]!.id,
      color: "Red",
      size: "S",
    };

    it("should throw error when user is not found", async () => {
      vi.mocked(findUserByIdService).mockResolvedValue(null);

      try {
        await addToCartService(
          mockParams.userId,
          mockParams.productId,
          mockParams.color,
          mockParams.size,
        );
      } catch (error: any) {
        expect(error).instanceOf(NotFoundError);
        expect(error.message).toBe("user is not found");
      }
    });

    it("should throw error when user select product with stock quantity = 0", async () => {
      vi.mocked(findUserByIdService).mockResolvedValue(mockUserData);

      vi.mocked(findProductVariantService).mockResolvedValue(
        mockProductList[0]?.variants[4],
      ); //stockQuantity = 0

      try {
        await addToCartService(
          mockParams.userId,
          mockParams.productId,
          mockParams.color,
          mockParams.size,
        );
      } catch (error: any) {
        expect(error).instanceOf(BadRequestError);
        expect(error.message).toBe(
          "Requested quantity exceeds available stock.",
        );
      }
    });

    it("should throw error when requested quantity exceeds available stock", async () => {
      vi.mocked(findUserByIdService).mockResolvedValue(mockUserData);

      vi.mocked(findProductVariantService).mockResolvedValue(
        mockProductList[0]?.variants[0],
      );

      vi.mocked(prisma.cart.findFirst).mockResolvedValue(mockCart);

      vi.mocked(prisma.$transaction).mockImplementation(
        async (callback: any) => {
          return await callback(mockTx);
        },
      );

      vi.mocked(mockTx.cartItem.findFirst).mockResolvedValue(mockCartItems[0]);

      try {
        await addToCartService(
          mockParams.userId,
          mockParams.productId,
          mockParams.color,
          mockParams.size,
        );
      } catch (error: any) {
        expect(error).instanceOf(BadRequestError);
        expect(error.message).toBe(
          "Requested quantity exceeds available stock.",
        );
      }
    });

    it("should  update add existed item quantity plus 1 and return cart on success", async () => {
      vi.mocked(findUserByIdService).mockResolvedValue(mockUserData);

      vi.mocked(findProductVariantService).mockResolvedValue(
        mockProductList[0]?.variants[1],
      );

      vi.mocked(prisma.cart.findFirst).mockResolvedValue(mockCart);

      vi.mocked(prisma.$transaction).mockImplementation(
        async (callback: any) => {
          return await callback(mockTx);
        },
      );

      vi.mocked(mockTx.cartItem.findFirst).mockResolvedValue(mockCartItems[1]);

      const updateCartItem = {
        ...mockCartItems[1],
        quantity: mockCartItems[1]!.quantity + 1,
      };

      vi.mocked(mockTx.cartItem.update).mockResolvedValue(updateCartItem);
      vi.mocked(mockTx.cart.findUnique).mockResolvedValue(mockCart);

      const res = await addToCartService(
        mockParams.userId,
        mockParams.productId,
        mockParams.color,
        mockParams.size,
      );

      expect(res).toBe(mockCart);
    });

    it("should create new cart and add new item on success", async () => {
      vi.mocked(findUserByIdService).mockResolvedValue(mockUserData);

      vi.mocked(findProductVariantService).mockResolvedValue(
        mockProductList[0]?.variants[1],
      );

      vi.mocked(prisma.cart.findFirst).mockResolvedValue(null);

      const newCart = { ...mockCart, items: [] };
      vi.mocked(prisma.cart.create).mockResolvedValue(newCart);

      vi.mocked(prisma.$transaction).mockImplementation(
        async (callback: any) => {
          return await callback(mockTx);
        },
      );

      vi.mocked(mockTx.cartItem.findFirst).mockResolvedValue(null);

      const newItem = { ...mockCartItems[1], quantity: 1 };
      vi.mocked(mockTx.cartItem.create).mockResolvedValue(newItem);

      const resCart = { ...mockCart, items: [newItem] };
      vi.mocked(mockTx.cart.findUnique).mockResolvedValue(resCart);

      const res = await addToCartService(
        mockParams.userId,
        mockParams.productId,
        mockParams.color,
        mockParams.size,
      );

      expect(res).toBe(resCart);
    });
  });
});
