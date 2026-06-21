import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  findUserByUsernameService,
  findUserByIdService,
  registerService,
  loginService,
} from "./auth-services";
import { prisma } from "../lib/prisma";
import { ConflictError, UnauthorizedError } from "../utils/custom-errors-utils";
import { hashPassword, verifyPassword } from "../utils/user-utils";

vi.mock("../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("../utils/user-utils", () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
}));

describe("auth-services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findUserByUsernameService", () => {
    const mockUsername = "mockUsername";
    it("should return user data on success", async () => {
      const mockUser = {
        id: 1,
        username: mockUsername,
      } as any;

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      const res = await findUserByUsernameService(mockUsername);

      expect(res).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledOnce();
    });
  });

  describe("findUserByIdService", () => {
    const mockId = 1;
    it("should return user data on success", async () => {
      const mockUser = {
        id: mockId,
      } as any;

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      const res = await findUserByIdService(mockId);

      expect(res).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledOnce();
    });
  });

  describe("registerService", () => {
    const mockPayload = {
      username: "mockUsername",
      password: "mockPassword123@",
    };

    it("should throw ConflictError if username already exists", async () => {
      const existingUser = { id: 1, username: mockPayload.username } as any;

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser);

      const res = registerService(mockPayload as any);

      await expect(res).rejects.toThrow(ConflictError);
    });

    it("should create and return new user with hashed password on success", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const newUser = {
        id: 1,
        username: mockPayload.username,
      } as any;

      vi.mocked(prisma.user.create).mockResolvedValue(newUser);

      const res = await registerService(mockPayload);

      expect(res).toEqual(newUser);
    });
  });

  describe("loginService", () => {
    const mockUsername = "username";
    const mockPassword = "Password123@";

    const mockUserResponse = {
      id: 1,
      username: mockUsername,
      password: "hashed_passworD_12@",
    };

    it("should return UnauthorizedError if username not found", () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      const res = loginService(mockUsername, mockPassword);

      expect(res).rejects.toThrow(UnauthorizedError);
    });

    it("should UnauthorizedError if password not correct", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUserResponse);

      vi.mocked(verifyPassword).mockReturnValue(false);

      await expect(loginService(mockUsername, mockPassword)).rejects.toThrow(
        UnauthorizedError,
      );

      expect(verifyPassword).toHaveBeenCalledWith(
        mockPassword,
        mockUserResponse.password,
      );
    });

    it("should return new user on success", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUserResponse);

      vi.mocked(verifyPassword).mockReturnValue(true);

      const res = await loginService(mockUsername, mockPassword);

      expect(res).toEqual(mockUserResponse);
    });
  });
});
