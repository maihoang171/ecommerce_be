import { it, expect, describe, vi } from "vitest";
import express from "express";
import { registerController } from "../controllers/user/user-controllers";
import { registerService } from "../services/user-services";
import { beforeEach } from "vitest";
import { errorHandler } from "../middleware/error";
import request from "supertest";

vi.mock("../services/user-services", () => ({
  registerService: vi.fn(),
}));

const app = express();
app.use(express.json());

app.post("/register", registerController);
app.use(errorHandler);

describe("registerController", () => {
  const mockValidPayload = {
    userName: "HoangPham1",
    password: "HoangPham123",
    firstName: "Hoang",
    lastName: "Pham",
    phoneNumber: "0954908928",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return status code 500 and error message on server error", async () => {
    vi.mocked(registerService).mockRejectedValue({ statusCode: 500 });

    const response = await request(app)
      .post("/register")
      .send(mockValidPayload);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      status: "error",
      message: "Internal server error",
    });
  });

  it("should return exact status code and message on unexpected error", async () => {
    const mockError = {
      statusCode: 400,
      message: "Bad request",
    };

    vi.mocked(registerService).mockRejectedValue(mockError);

    const response = await request(app)
      .post("/register")
      .send(mockValidPayload);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      message: "Bad request",
    });
  });
  it("should return status code 400 and error message on invalid input or missing fields", async () => {
    const { userName, ...mockInvalidPayload } = mockValidPayload;

    const response = await request(app)
      .post("/register")
      .send(mockInvalidPayload);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      message: "Missing fields or invalid input",
    });
  });

  it("should return status code 409 and error message on duplicate record", async () => {
    vi.mocked(registerService).mockRejectedValue({
      code: "P2002",
      message: "Duplicate record found",
    });

    const response = await request(app)
      .post("/register")
      .send(mockValidPayload);

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({
      status: "error",
      message: "Duplicate record found",
    });
  });
});
