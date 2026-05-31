import type { User } from "@prisma/client";
import z from "zod";

export const baseUserDTO = z.object({
  userName: z
    .string()
    .trim()
    .min(3, "User name must have at least 3 characters")
    .max(20, "User name must have at most 20 characters")
    .regex(
      /^[0-9a-zA-Z_-]+$/,
      "User name must not have special characters (except _ and -)",
    ),
  password: z
    .string()
    .min(6, "Password must have at least 6 characters")
    .regex(/[A-Z]/, "Password must have at least one uppercase letter")
    .regex(/[a-z]/, "Password must have at least one lowercase letter")
    .regex(/[0-9]/, "Password must have at least one number"),
});

export const registerUserDTO = baseUserDTO
  .extend({
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
    "id" | "userName" | "firstName" | "lastName" | "phoneNumber" | "isAdmin"
  >,
) => {
  return {
    id: user.id,
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    isAdmin: user.isAdmin,
  };
};
