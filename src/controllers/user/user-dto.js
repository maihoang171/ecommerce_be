import z from "zod";

export const authBase = z.object({
  username: z.string().min(3, "User name must have at least 3 characters"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});

export const registerUserDTO = z
  .object({
    ...authBase,
    firstName: z.string().min(1, "First name must not be empty"),
    lastName: z.string().min(1, "Last name must not be empty"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must have at least 10 numbers")
      .optional()
      .or(z.literal("")),
  })
  .strict();

export const userResponseDTO = (user) => {
  return {
    id: user.id,
    username: user.username,
    fullName: `${user.firstName} ${user.lastName}`,
    role: user.role,
    phone: user.phoneNumber || "N/A",
    createdAt: user.createdAt,
  };
};

export const loginDTO = authBase;
