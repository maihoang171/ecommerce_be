import { it, expect, describe, vi } from "vitest";
import express from "express";
import { registerController, loginController } from "./user-controllers";
import {
  registerService,
  loginService,
  createRefreshTokenService,
} from "../../services/user-services";
import { beforeEach, afterEach } from "vitest";
import { errorHandler } from "../../middleware/error";
import request from "supertest";

vi.mock("../../services/user-services", () => ({
  registerService: vi.fn(),
  loginService: vi.fn(),
  createRefreshTokenService: vi.fn(),
}));

vi.mock("../../middleware/error", () => ({
  errorHandler: vi.fn(),
}));

const app = express();
app.use(express.json());

app.post("/register", registerController);
app.post("/login", loginController);
app.use(errorHandler);

describe("registerController", () => {
  const mockUserData = {
    id: 1,
    userName: "HoangPham1",
    firstName: "Hoang123",
    lastName: "Pham",
    phoneNumber: "0954908928",
  };

  const mockPayload = {
    userName: "HoangPham1",
    password: "HoangPham123",
    firstName: "Hoang",
    lastName: "Pham",
    phoneNumber: "0954908928",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return status code 201, message and user data on success", async () => {
    const mockResponse = {
      success: true,
      data: mockUserData,
    };

    vi.mocked(registerService).mockResolvedValue(mockUserData);
    const response = await request(app).post("/register").send(mockPayload);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(mockResponse);
  });

  it("should register successfully even when phoneNumber is missing", async () => {
    vi.mocked(registerService).mockResolvedValue(mockUserData);

    const { phoneNumber, ...mockPayloadWithoutPhone } = mockPayload;

    const response = await request(app)
      .post("/register")
      .send(mockPayloadWithoutPhone);

    expect(response.statusCode).toBe(201);
  });
});

describe("loginController", () => {
  const mockValidPayload = {
    userName: "HoangPham1",
    password: "HoangPham123",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubEnv("JWT_SECRET", "super_secure_test_fallback_secret_key_123");
    vi.stubEnv("NODE_ENV", "test");
  });

  afterEach(() => {
    // Clean up and restore original environment variables after each test
    vi.unstubAllEnvs();
  });

  it("should return status code 200, message and user data on success", async () => {
    const mockUserData = {
      id: 1,
      userName: "HoangPham1",
      firstName: "Hoang123",
      lastName: "Pham",
      phoneNumber: "0954908928",
      role: "USER",
    };

    const mockResponse = {
      success: true,
      data: mockUserData,
    };
    vi.mocked(loginService).mockResolvedValue(mockUserData);

    const response = await request(app).post("/login").send(mockValidPayload);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it("should return status code 401 on invalid username or password", async () => {
    vi.mocked(loginService).mockResolvedValue(null);

    const response = await request(app).post("/login").send(mockValidPayload);

    expect(response.statusCode).toBe(401);
  });

  it("should call next middleware on error", async () => {
    const mockError = new Error("Test error");
    vi.mocked(loginService).mockRejectedValue(mockError);
    const mockNext = vi.fn();

    const mockReq = {
      body: mockValidPayload,
    };

    await loginController(mockReq as any, {} as any, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});
