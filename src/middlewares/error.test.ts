import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Response, Request } from "express-serve-static-core";
import { sendError } from "../utils/response-utils";
import { errorHandler, type ErrorWithStatusCode } from "./error";
import { ZodError } from "zod";

vi.mock("../utils/response-utils", () => ({
  sendError: vi.fn(),
}));

describe("errorHandler", () => {
  const mockReq = {} as Request;
  const mockRes = {} as Response;
  const mockNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return specific status code and message on error", () => {
    const mockError = new Error("Something went wrong") as ErrorWithStatusCode;
    mockError.statusCode = 500;

    errorHandler(mockError, mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      mockError.statusCode,
      "Something went wrong",
    );
  });
  it("should return status code 500 and default error message on unknown error", () => {
    const mockErrMessage = "Internal server error";
    const mockError = new Error("") as ErrorWithStatusCode;

    errorHandler(mockError, mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(mockRes, 500, mockErrMessage);
  });

  it("should return status code 409 and error message on duplicate record error", () => {
    const mockErrMessage = "Duplicate record found";
    const mockError = new Error(mockErrMessage) as ErrorWithStatusCode;
    mockError.code = "P2002";

    errorHandler(mockError, mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(mockRes, 409, mockErrMessage);
  });

  it("should return status code 500 and error message on prisma error", () => {
    const mockErrMsg = "prisma error";

    const mockErrMsgRes =
      "Server is undergoing maintenance. Please try again later.";
    const mockError = new Error(mockErrMsgRes) as ErrorWithStatusCode;
    mockError.message = mockErrMsg;

    errorHandler(
      mockError as unknown as ErrorWithStatusCode,
      mockReq,
      mockRes,
      mockNext,
    );

    expect(sendError).toHaveBeenCalledWith(mockRes, 500, mockErrMsgRes);
  });

  it("should return status code 400 and error message on ZodError", () => {
    const mockErrMessage = "Missing fields or invalid input";
    const mockError = new ZodError([]);

    errorHandler(
      mockError as unknown as ErrorWithStatusCode,
      mockReq,
      mockRes,
      mockNext,
    );

    expect(sendError).toHaveBeenCalledWith(mockRes, 400, mockErrMessage);
  });
});
