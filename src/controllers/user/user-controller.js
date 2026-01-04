import { registerUserService } from "../../services/user-service.js";
import { userResponseDTO, registerUserDTO } from "./user-dto.js";

export const registerUserController = async (req, res, next) => {
  try {
    const validatedData = registerUserDTO.parse(req.body);
    const newUser = await registerUserService(validatedData);

    return res.status(201).json({
      status: "success",
      data: userResponseDTO(newUser),
    });
  } catch (error) {
    next(error);
  }
};
