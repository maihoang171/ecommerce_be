import type {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";
import { registerUserDTO, userResponseDto, baseUserDTO } from "./user-dto";
import {
  registerService,
  loginService,
  findUserByIdService,
  verifyRefreshTokenService,
} from "../../services/user-services";
import { sendError, sendSuccess } from "../../utils/response-utils";
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
    const validatedData = registerUserDTO.parse(req.body);
    const newUser = await registerService({
      ...validatedData,
      phoneNumber: validatedData.phoneNumber ?? "",
    });

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
    const validatedData = baseUserDTO.parse(req.body);
    const { userName, password } = validatedData;
    const user = await loginService(userName, password);

    if (!user) {
      return sendError(res, 401, "Invalid username or password");
    }

    generateAndSetAccessToken(res, user);
    await generateAndSetRefreshToken(res, user);

    sendSuccess(res, 200, userResponseDto(user));
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
      return sendError(res, 401, "Refresh token is missing. Please login again!");
    }

    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_SECRET!) as { id: number };

    const isTokenValid = await verifyRefreshTokenService(decoded.id, oldRefreshToken);
    if (!isTokenValid) {
      return sendError(res, 401, "Invalid refresh token or session expired. Please login again!");
    }

    const user = await findUserByIdService(decoded.id);
    if (!user) {
      return sendError(res, 404, "User no longer exists. Please login again!");
    }

    generateAndSetAccessToken(res, user);
    await generateAndSetRefreshToken(res, user);

    sendSuccess(res, 200, userResponseDto(user));
  } catch (error) {
    next(error);
  }
}