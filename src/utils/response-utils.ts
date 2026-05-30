import type { Response } from "express-serve-static-core";
import type { NullableIntFieldUpdateOperationsInput } from "../../generated/prisma/models";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T | null;
};

export const sendSuccess = <T>(res: Response, statusCode: number, data: T) => {
  const payload: ApiResponse<T> = {
    success: true,
    data,
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (res: Response, statusCode: number, message: string) => {
  const payload: ApiResponse<null> = {
    success: false,
    message,
  }
  return res.status(statusCode).json(payload)
}