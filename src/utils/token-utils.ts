import jwt from "jsonwebtoken";
import type { Response } from "express-serve-static-core";
import { createRefreshTokenService } from "../services/user-services";

export const generateAndSetAccessToken = (
  res: Response,
  user: {
    id: number;
    userName: string;
    role: string;
  },
) => {
  const payload = {
    id: user.id,
    userName: user.userName,
    role: user.role,
  };

  const jwtSecret = process.env.JWT_SECRET!;

  const oneHour = 60 * 60 * 1000;
  const accessToken = jwt.sign(payload, jwtSecret, {
    expiresIn: "1h",
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: oneHour,
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

  await createRefreshTokenService(user.id, refreshToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: sevenDay,
    path: "/api/v1/auth/refresh-token",
  });
};
