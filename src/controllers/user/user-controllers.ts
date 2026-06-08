import type {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";
import { userResponseDto } from "./user-dto";
import { baseUserSchema } from "../../schemas/authSchema";
import {
  registerService,
  loginService,
  findUserByIdService,
  verifyRefreshTokenService,
} from "../../services/auth-services";
import { sendAuthSuccess, sendError, sendSuccess } from "../../utils/response-utils";
import {
  generateAndSetAccessToken,
  generateAndSetRefreshToken,
} from "../../utils/token-utils";
import jwt from "jsonwebtoken";

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
    const { userName, password } = validatedData;
    const user = await loginService(userName, password);

    if (!user) {
      return sendError(res, 401, "Invalid username or password");
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
      return sendError(res, 401, "Unauthorized access. Please login again!");
    }

    const userFromDB = await findUserByIdService(user.id);
    if (!userFromDB) {
      return sendError(res, 404, "User no longer exists. Please login again!");
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
      return sendError(
        res,
        401,
        "Refresh token is missing. Please login again!",
      );
    }

    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_SECRET!) as {
      id: number;
    };

    const isTokenValid = await verifyRefreshTokenService(
      decoded.id,
      oldRefreshToken,
    );
    if (!isTokenValid) {
      return sendError(
        res,
        401,
        "Invalid refresh token or session expired. Please login again!",
      );
    }

    const user = await findUserByIdService(decoded.id);
    if (!user) {
      return sendError(res, 404, "User no longer exists. Please login again!");
    }

    const accessToken = generateAndSetAccessToken(user);
    await generateAndSetRefreshToken(res, user);

    sendAuthSuccess(res, 200, accessToken, userResponseDto(user));
  } catch (error) {
    next(error);
  }
};
