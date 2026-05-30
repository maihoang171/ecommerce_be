import type {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";
import { registerUserDTO, userResponseDto } from "./user-dto";
import { registerService } from "../../services/user-services";

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

    res.status(201).json({
      message: "success",
      data: userResponseDto(newUser),
    });
  } catch (error) {
    next(error);
  }
};
