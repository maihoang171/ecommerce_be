import { describe, it, expect, vi } from "vitest";
import type { Response } from "express-serve-static-core";
import { sendError, sendSuccess } from "../utils/response-utils";
describe("response utilities", () => {
  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;

  describe("sendSuccess", () => {
    it("should call res.status and res.json with correct arguments", () => {
      const mockData = {
        id: 1,
        userName: "HoangPham1",
      };
      const mockStatusCode = 201;
      sendSuccess(mockRes, mockStatusCode, mockData);
      expect(mockRes.status).toHaveBeenCalledWith(mockStatusCode);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockData,
      });
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
