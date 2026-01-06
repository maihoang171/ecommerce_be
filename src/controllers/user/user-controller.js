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

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    })

    res.status(200).json({
      status: "success",
      data: userResponseDTO(result.user),
    });
  } catch (error) {
    next(error);
  }
};
