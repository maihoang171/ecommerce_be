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
} from "../../services/user-services";
import { sendError, sendSuccess } from "../../utils/response-utils";
import {
  generateAndSetAccessToken,
  generateAndSetRefreshToken,
} from "../../utils/token-utils";

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
