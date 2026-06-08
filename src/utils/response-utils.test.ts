import { describe, it, expect, vi } from "vitest";
import type { Response } from "express-serve-static-core";
import { sendAuthSuccess, sendError, sendSuccess } from "../utils/response-utils";

describe("response utilities", () => {
  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;

  const mockData = {
    id: 1,
    userName: "HoangPham1",
  };

  describe("sendSuccess", () => {
    it("should call res.status and res.json with correct arguments", () => {
      const mockStatusCode = 201;
      sendSuccess(mockRes, mockStatusCode, mockData);
      expect(mockRes.status).toHaveBeenCalledWith(mockStatusCode);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockData,
      });
    });
  });

  describe("sendAuthSuccess", () => {
    it("should call res.status and res.json with correct arguments", () => {
      const mockStatusCode = 201;
      const mockAccessToken = "mocked-token";
      sendAuthSuccess(mockRes, mockStatusCode, mockAccessToken, mockData);

      expect(mockRes.status).toHaveBeenCalledWith(mockStatusCode)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        accessToken: mockAccessToken,
        data: mockData,
      })
    });
  });

  describe("sendError", () => {
    it("should call res.status and res.json with correct arguments", () => {
      const mockStatusCode = 404;
      const mockMessage = "User not found";

      sendError(mockRes, mockStatusCode, mockMessage);

      expect(mockRes.status).toHaveBeenCalledWith(mockStatusCode);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: mockMessage,
      });
    });
  });
});
