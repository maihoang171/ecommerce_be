import type {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";
import { registerUserDTO, userResponseDto, baseUserDTO } from "./user-dto";
import {
  registerService,
  loginService,
} from "../../services/user-services";
import { sendError, sendSuccess } from "../../utils/response-utils";
import { generateAndSetTokens } from "../../utils/token-utils";

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

   await generateAndSetTokens(res, user);

    sendSuccess(res, 200, userResponseDto(user));
  } catch (error) {
    next(error);
  }
};
