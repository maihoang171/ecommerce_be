import { it, expect, describe, vi } from "vitest";
import express from "express";
import { registerController } from "./user-controllers";
import { registerService } from "../../services/user-services";
import { beforeEach } from "vitest";
import { errorHandler } from "../../middleware/error";
import request from "supertest";
import { ZodFirstPartyTypeKind } from "zod/v3";

vi.mock("../../services/user-services", () => ({
  registerService: vi.fn(),
}));

const app = express();
app.use(express.json());

app.post("/register", registerController);
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
      message: "success",
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
