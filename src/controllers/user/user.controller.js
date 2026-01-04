import { registerUserService } from "../../services/user.service.js";
import { UserResponseDTO, RegisterUserDTO } from "./user.dto.js";

export const registerUserController = async (req, res, next) => {
  try {
    const validatedData = RegisterUserDTO.parse(req.body);
    const newUser = await registerUserService(validatedData);

    return res.status(201).json({
      status: "success",
      data: UserResponseDTO(newUser),
    });
  } catch (error) {
    next(error);
  }
};
