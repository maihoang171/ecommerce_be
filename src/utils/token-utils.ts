import jwt from "jsonwebtoken";
import type { Response } from "express-serve-static-core";
import { createRefreshTokenService } from "../services/user-services";

export const generateAndSetTokens = async (
  res: Response,
  user: {
    id: number;
    userName: string;
    role: string;
  },
) => {
  const accessTokenPayload = {
    id: user.id,
    userName: user.userName,
    role: user.role,
  };

  const jwtSecret = process.env.JWT_SECRET!;

  const oneHour = 60 * 60 * 1000;
  const accessToken = jwt.sign(accessTokenPayload, jwtSecret, {
    expiresIn: "1h",
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: oneHour,
  });

  //Create refresh token
  const refreshTokenPayload = {
    id: user.id,
  };

  const sevenDay = 7 * 24 * 60 * 60 * 1000;
  const refreshToken = jwt.sign(refreshTokenPayload, jwtSecret, {
    expiresIn: "7d",
  });

  await createRefreshTokenService(user.id, refreshToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: sevenDay,
    path: "/api/vi/auth/refresh-token",
  });
};
