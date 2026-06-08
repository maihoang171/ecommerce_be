import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";
import { authenticateJwt } from "../middlewares/authenticateJwt";
import { sendError } from "../utils/response-utils";
import jwt from "jsonwebtoken";
import type { JwtUserPayload } from "../middlewares/authenticateJwt";

vi.mock("../utils/response-utils", () => ({
  sendError: vi.fn(),
}));
vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));

describe("authenticateJwt", () => {
  const TEST_SECRET = "my-jwt-secret";

  beforeEach(() => {
    vi.resetAllMocks();

    vi.stubEnv("JWT_SECRET", TEST_SECRET);
  });

  const mockReq = {
    cookies: {},
    headers: {},
    user: undefined,
  } as unknown as Request & { user?: JwtUserPayload };
  const mockRes = {} as Response;
  const mockNext = vi.fn();

  it("should return status code 401 and message when token is missing", () => {
    authenticateJwt(mockReq, mockRes, mockNext);
    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      401,
      "Token is missing or invalid format.",
    );
  });

  it("should return status code 401 and message when token part is empty after Bearer prefix", () => {
    mockReq.headers.authorization = "Bearer ";

    authenticateJwt(mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      401,
      "Token is missing or invalid format.",
    );
  });
  it("should verify the token and call next when token is valid", () => {
    const mockUser = {
      id: 1,
      userName: "testUser",
      isAdmin: false,
    } as JwtUserPayload;

    (jwt.verify as any).mockReturnValue(mockUser);
    mockReq.headers.authorization = "Bearer mocked-token";
    const accessToken = "mocked-token";

    authenticateJwt(mockReq, mockRes, mockNext);
    expect(jwt.verify).toHaveBeenCalledWith(accessToken, TEST_SECRET);
    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return status code 401 and message when token is invalid", () => {
    mockReq.headers.authorization = "Bearer invalid.git.token";

    (jwt.verify as any).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authenticateJwt(mockReq, mockRes, mockNext);
    expect(sendError).toHaveBeenCalledWith(mockRes, 401, "Invalid token.");
  });
});
