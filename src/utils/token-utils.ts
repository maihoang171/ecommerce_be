import jwt from "jsonwebtoken";
import type { Response, NextFunction } from "express-serve-static-core";
import { createRefreshTokenService } from "../services/auth-services";
import { sendError } from "./response-utils";

export const generateAndSetAccessToken = (user: {
  id: number;
  username: string;
  isAdmin: boolean;
}) => {
  const payload = {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
  };

  const jwtSecret = process.env.JWT_SECRET!;

  return jwt.sign(payload, jwtSecret, {
    expiresIn: "1h",
  });
};

export const generateAndSetRefreshToken = async (
  res: Response,
  user: { id: number },
) => {
  const payload = {
    id: user.id,
  };

  const jwtSecret = process.env.JWT_SECRET!;

  const sevenDay = 7 * 24 * 60 * 60 * 1000;
  const refreshToken = jwt.sign(payload, jwtSecret, {
    expiresIn: "7d",
  });

  try {
    await createRefreshTokenService(user.id, refreshToken);
  } catch (error) {
    return sendError(
      res,
      500,
      "Something went wrong when creating refresh token!",
    );
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: sevenDay,
    path: "/api/v1/auth/refresh-token",
  });
};
