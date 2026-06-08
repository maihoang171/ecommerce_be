import z from "zod";

export const baseUserSchema = z.object({
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
    .min(8, "Password must have at least 8 characters")
    .regex(/[A-Z]/, "Password must have at least one uppercase letter")
    .regex(/[a-z]/, "Password must have at least one lowercase letter")
    .regex(/[0-9]/, "Password must have at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must have at least one special character"),
});
