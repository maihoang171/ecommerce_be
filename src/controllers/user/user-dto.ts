import type { User } from "../../../generated/prisma/client";
import z from "zod";

export const registerUserDTO = z
  .object({
    userName: z
      .string()
      .trim()
      .min(3, "User name must have at least 3 characters"),
    password: z
      .string()
      .min(6, "Password must have at least 6 characters")
      .regex(/[A-Z]/, "Password must have at least one uppercase letter")
      .regex(/[a-z]/, "Password must have at least one lowercase letter")
      .regex(/[0-9]/, "Password must have at least one number"),
    firstName: z
      .string()
      .trim()
      .min(1, "First name must have at least one letter"),
    lastName: z
      .string()
      .trim()
      .min(1, "Last name must have at least one letter"),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Phone number must have exact 10 numbers")
      .optional()
      .or(z.literal("")),
  })
  .strict();

export const userResponseDto = (
  user: Pick<
    User,
    "id" | "userName" | "firstName" | "lastName" | "phoneNumber"
  >,
) => {
  return {
    id: user.id,
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
  };
};
