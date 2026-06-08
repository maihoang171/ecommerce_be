import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Response } from "express-serve-static-core";
import {
  generateAndSetAccessToken,
  generateAndSetRefreshToken,
} from "../utils/token-utils";
import jwt from "jsonwebtoken";
import { createRefreshTokenService } from "../services/auth-services";
import { sendError } from "./response-utils";

vi.mock("jsonwebtoken", () => ({
  default: { sign: vi.fn() },
}));

vi.mock("../services/auth-services", () => ({
  createRefreshTokenService: vi.fn(),
}));

vi.mock("../utils/response-utils", () => ({
  sendError: vi.fn(),
}));

describe("token utilities", () => {
  const TEST_SECRET = "my-jwt-secret";
  const mockRes = {
    cookie: vi.fn(),
  } as unknown as Response;

  beforeEach(() => {
    vi.resetAllMocks();

    vi.stubEnv("JWT_SECRET", TEST_SECRET);
    vi.stubEnv("NODE_ENV", "test");
  });

  describe("generateAndSetAccessToken", () => {
    const mockUser = {
      id: 1,
      userName: "testUser",
      isAdmin: false,
    };

    const mockAccessToken = "mocked-token";

    it("should sign a JWT with the correct payload and set the accessToken cookie", () => {
      (jwt.sign as any).mockReturnValue(mockAccessToken);

      generateAndSetAccessToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          userName: mockUser.userName,
          isAdmin: mockUser.isAdmin,
        },
        TEST_SECRET,
        {
          expiresIn: "1h",
        },
      );
    });
  });

  describe("generateAndSetRefreshToken", () => {
    const mockUser = {
      id: 1,
    };
    const mockRefreshToken = "mocked-token";

    it("should sign a JWT with the correct payload, create a refresh token into the database and set the refreshToken cookie", async () => {
      (jwt.sign as any).mockReturnValue(mockRefreshToken);

      await createRefreshTokenService(mockUser.id, mockRefreshToken);

      await generateAndSetRefreshToken(mockRes, mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser.id,
        },
        TEST_SECRET,
        {
          expiresIn: "7d",
        },
      );

      expect(createRefreshTokenService).toHaveBeenCalledWith(
        mockUser.id,
        "mocked-token",
      );

      expect(mockRes.cookie).toHaveBeenCalledWith(
        "refreshToken",
        mockRefreshToken,
        {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/api/v1/auth/refresh-token",
        },
      );
    });

    it("should return status code 500 and message on server error", async () => {
      (jwt.sign as any).mockReturnValue(mockRefreshToken);

      const errMsg = "Something went wrong when creating refresh token!";
      const mockError = new Error(errMsg);

      await createRefreshTokenService(mockUser.id, mockRefreshToken);

      vi.mocked(createRefreshTokenService).mockRejectedValue(mockError);

      await generateAndSetRefreshToken(mockRes, mockUser);

      expect(sendError).toHaveBeenCalledWith(mockRes, 500, errMsg);
    });

    it("should turn secure true in production", async () => {
      vi.stubEnv("NODE_ENV", "production");

      (jwt.sign as any).mockReturnValue(mockRefreshToken);

      await createRefreshTokenService(mockUser.id, mockRefreshToken);

      await generateAndSetRefreshToken(mockRes, mockUser);

      expect(mockRes.cookie).toHaveBeenCalledWith(
        "refreshToken",
        mockRefreshToken,
        {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/api/v1/auth/refresh-token",
        },
      );
    });
  });
});
