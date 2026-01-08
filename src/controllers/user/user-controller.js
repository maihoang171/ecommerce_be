import {
  loginService,
  registerService,
  getMeService,
} from "../../services/user-service.js";
import { userResponseDTO, registerUserDTO, loginDTO } from "./user-dto.js";

export const registerController = async (req, res, next) => {
  try {
    const validatedData = registerUserDTO.parse(req.body);
    console.log(req.body);
    const newUser = await registerService(validatedData);

    res.status(201).json({
      status: "success",
      data: userResponseDTO(newUser),
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const validatedData = loginDTO.parse(req.body);
    const result = await loginService(validatedData);

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const getMeController = async (req, res) => {
  try {
    const user = await getMeService(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "user is no longer exists",
      });
    }

    res.status(200).json({
      status: "success",
      data: userResponseDTO(user),
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res) => {
   res.cookie("accessToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    
    res.status(200).json({
      status: "success",
    });
}
