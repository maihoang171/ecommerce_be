import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
  findUserByUsernameService,
  findUserByIdService,
  registerService,
  loginService,
  createRefreshTokenService,
  logoutService,
  verifyRefreshTokenService,
} from "./auth-services";
import { prisma } from "../lib/prisma";
import { ConflictError, UnauthorizedError } from "../errors/custom-errors";
import { hashPassword, hashToken, verifyPassword } from "../utils/user-utils";
import { mockValidUserDataInput, mockUserData } from "../tests/mockData";
import { addDays } from "date-fns";

vi.mock("date-fns", () => ({
  addDays: vi.fn(),
}));

vi.mock("../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    refreshToken: {
      findFirst: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock("../utils/user-utils", () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
  hashToken: vi.fn(),
}));

describe("auth-services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findUserByUsernameService", () => {
    it("should return user data on success", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUserData);
      const res = await findUserByUsernameService(
        mockValidUserDataInput.username,
      );

      expect(res).toEqual(mockUserData);
      expect(prisma.user.findUnique).toHaveBeenCalledOnce();
    });
  });

  describe("findUserByIdService", () => {
    it("should return user data on success", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUserData);
      const res = await findUserByIdService(mockUserData.id);

      expect(res).toEqual(mockUserData);
      expect(prisma.user.findUnique).toHaveBeenCalledOnce();
    });
  });

  describe("registerService", () => {
    it("should throw ConflictError if username already exists", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUserData);

      const res = registerService(mockValidUserDataInput as any);

      await expect(res).rejects.toThrow(ConflictError);
    });

    it("should create and return new user with hashed password on success", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      vi.mocked(prisma.user.create).mockResolvedValue(mockUserData);

      const mockFakeHashedPassword = "HashedPassword123";
      vi.mocked(hashPassword).mockReturnValue(mockFakeHashedPassword);

      const res = await registerService(mockValidUserDataInput);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: mockValidUserDataInput.username,
          password: mockFakeHashedPassword,
        },
      });
      expect(res).toEqual(mockUserData);
    });
  });

  describe("loginService", () => {
    const mockUserResponse = {
      ...mockUserData,
      password: "hashed_passworD_12@",
    };

    it("should return UnauthorizedError if username not found", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const res = loginService(
        mockValidUserDataInput.username,
        mockValidUserDataInput.password,
      );

      await expect(res).rejects.toThrow(UnauthorizedError);
    });

    it("should UnauthorizedError if password not correct", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUserResponse);

      vi.mocked(verifyPassword).mockReturnValue(false);

      await expect(
        loginService(
          mockValidUserDataInput.username,
          mockValidUserDataInput.password,
        ),
      ).rejects.toThrow(UnauthorizedError);

      expect(verifyPassword).toHaveBeenCalledWith(
        mockValidUserDataInput.password,
        mockUserResponse.password,
      );
    });

    it("should return new user on success", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUserResponse);

      vi.mocked(verifyPassword).mockReturnValue(true);

      const res = await loginService(
        mockValidUserDataInput.username,
        mockValidUserDataInput.password,
      );

      expect(res).toEqual(mockUserResponse);
    });
  });

  describe("createRefreshTokenService", () => {
    const mockUserId = 1;
    const mockRawToken = "raw_refresh_token_123";
    const mockHashedToken = "hashed_refresh_token_abc";

    const mockFutureDate = new Date("2026-12-31T00:00:00.000Z");

    it("should delete old tokens and create a new hashed refresh token", async () => {
      vi.mocked(addDays).mockReturnValue(mockFutureDate);
      vi.mocked(hashToken).mockReturnValue(mockHashedToken);

      vi.mocked(prisma.refreshToken.deleteMany).mockResolvedValue({ count: 1 });

      const mockCreateRecord = {
        id: 15,
        userId: mockUserId,
        token: mockHashedToken,
        expiredAt: mockFutureDate,
      } as any;

      vi.mocked(prisma.refreshToken.create).mockResolvedValue(mockCreateRecord);
      const res = await createRefreshTokenService(mockUserId, mockRawToken);

      expect(hashToken).toHaveBeenCalledWith(mockRawToken);

      expect(prisma.refreshToken.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          token: mockHashedToken,
          expiredAt: mockFutureDate,
        },
      });
      expect(res).toEqual(mockCreateRecord);
    });
  });

  describe("verifyRefreshTokenService", () => {
    const mockUserId = 1;
    const mockIncomingRefreshToken = "incoming_token_123";
    const mockHashedToken = "hashed_refresh_token_abc";

    beforeEach(() => {
      vi.useFakeTimers();

      vi.setSystemTime(new Date("2026-06-26T00:00:00.000Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return false when inComingRefreshToken does not exists on DB", async () => {
      vi.mocked(hashToken).mockReturnValue(mockHashedToken);
      vi.mocked(prisma.refreshToken.findFirst).mockResolvedValue(null);

      const res = await verifyRefreshTokenService(
        mockUserId,
        mockIncomingRefreshToken,
      );

      expect(hashToken).toHaveBeenCalledWith(mockIncomingRefreshToken);

      expect(prisma.refreshToken.findFirst).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          token: mockHashedToken,
        },
      });
      expect(res).toBe(false);
    });

    it("should return false when refresh token is expired", async () => {
      vi.mocked(hashToken).mockReturnValue(mockHashedToken);

      const mockExpiredTokenRes = {
        id: 10,
        token: mockHashedToken,
        expiredAt: new Date("2026-06-25T12:00:00.000Z"), //yesterday
      };

      vi.mocked(prisma.refreshToken.findFirst).mockResolvedValue(
        mockExpiredTokenRes,
      );

      const res = await verifyRefreshTokenService(
        mockUserId,
        mockIncomingRefreshToken,
      );

      expect(res).toBe(false);
    });

    it("should return true if token exists and is NOT expired", async () => {
      vi.mocked(hashToken).mockReturnValue(mockHashedToken);

      const mockValidTokenRes = {
        id: 10,
        token: mockHashedToken,
        expiredAt: new Date("2026-06-27T12:00:00.000Z"), //tomorrow
      };

      vi.mocked(prisma.refreshToken.findFirst).mockResolvedValue(
        mockValidTokenRes,
      );

      const res = await verifyRefreshTokenService(
        mockUserId,
        mockIncomingRefreshToken,
      );

      expect(res).toBe(true);
    });
  });

  describe("logOutService", () => {
    it("should delete tokens on success", async () => {
      const mockUserId = 1;
      vi.mocked(prisma.refreshToken.deleteMany).mockResolvedValue({ count: 1 });

      await logoutService(mockUserId);

      expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
        },
      });
    });
  });
});
