import type {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";
import { userResponseDto } from "./user-dto";
import { baseUserSchema } from "../../schemas/auth-schema";
import {
  registerService,
  loginService,
  findUserByIdService,
  verifyRefreshTokenService,
  logoutService,
} from "../../services/auth-services";
import { sendAuthSuccess, sendError, sendSuccess } from "../../utils/response-utils";
import {
  generateAndSetAccessToken,
  generateAndSetRefreshToken,
} from "../../utils/token-utils";
import jwt from "jsonwebtoken";
import { NotFoundError, UnauthorizedError } from "../../utils/custom-errors-utils";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = baseUserSchema.parse(req.body);
    const newUser = await registerService(validatedData);

    sendSuccess(res, 201, userResponseDto(newUser));
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = baseUserSchema.parse(req.body);

    const { username, password } = validatedData;
    const user = await loginService(username, password);

    if (!user) {
      throw new UnauthorizedError("Invalid username or password");
    }

    const accessToken = generateAndSetAccessToken(user);
    await generateAndSetRefreshToken(res, user);

    sendAuthSuccess(res, 200, accessToken, userResponseDto(user));
  } catch (error) {
    next(error);
  }
};

export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError("Unauthorized access. Please login again!");
    }

    const userFromDB = await findUserByIdService(user.id);
    if (!userFromDB) {
      throw new NotFoundError("User no longer exists. Please login again!");
    }

    sendSuccess(res, 200, userResponseDto(userFromDB));
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      throw new UnauthorizedError(
        "Refresh token is missing. Please login again!",
      );
    }

    let decoded: { id: number };
    
    try {
      decoded = jwt.verify(oldRefreshToken, process.env.JWT_SECRET!) as {
        id: number;
      };
    } catch (jwtErr) {
      throw new UnauthorizedError(
        "Session expired or invalid token. Please login again!",
      );
    }

    const isTokenValid = await verifyRefreshTokenService(
      decoded.id,
      oldRefreshToken,
    );

    if (!isTokenValid) {
      throw new UnauthorizedError(
        "Invalid refresh token or session expired. Please login again!",
      );
    }

    const user = await findUserByIdService(decoded.id);
    if (!user) {
      throw new NotFoundError("User no longer exists. Please login again!");
    }

    const accessToken = generateAndSetAccessToken(user);
    await generateAndSetRefreshToken(res, user);

    sendAuthSuccess(res, 200, accessToken, null);
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let userId = req.user?.id;

    const refreshToken = req.cookies.refreshToken;
    if (!userId && refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as {
          id: number;
        };
        userId = decoded.id;
      } catch (error) {
        console.error(
          "Error verifying refresh token during fallback logout:",
          error,
        );
      }
    }

    if (userId) {
      await logoutService(userId);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/v1/auth/refresh-token",
    });

    sendSuccess(res, 200, null, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};
