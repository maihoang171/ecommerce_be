import {
  loginUserService,
  registerUserService,
} from "../../services/user-service.js";
import { userResponseDTO, registerUserDTO, loginDTO } from "./user-dto.js";

export const registerUserController = async (req, res, next) => {
  try {
    const validatedData = registerUserDTO.parse(req.body);
    const newUser = await registerUserService(validatedData);

    res.status(201).json({
      status: "success",
      data: userResponseDTO(newUser),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const validatedData = loginDTO.parse(req.body);
    const result = await loginUserService(validatedData);

    res.status(200).json({
      status: "success",
      data: userResponseDTO(result.user),
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};
