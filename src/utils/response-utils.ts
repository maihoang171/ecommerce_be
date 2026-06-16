import type { Response } from "express-serve-static-core";

export type ApiResponse<T> = {
  success: boolean;
  accessToken?: string;
  message?: string;
  data?: T | null;
};

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  data: T,
  message: string = "",
) => {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(payload);
};

export const sendAuthSuccess = <T>(
  res: Response,
  statusCode: number,
  accessToken: string,
  data: T,
) => {
  const payload: ApiResponse<T> = {
    success: true,
    accessToken,
    data,
  };

  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
) => {
  const payload: ApiResponse<null> = {
    success: false,
    message,
  };
  return res.status(statusCode).json(payload);
};
