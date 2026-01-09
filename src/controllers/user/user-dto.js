import z from "zod";

export const authBase = z.object({
  username: z.string().min(3, "User name must have at least 3 characters"),
  password: z
    .string()
    .min(6, "Password must have at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const registerUserDTO = authBase
  .extend({
    firstName: z.string().min(1, "First name must not be empty"),
    lastName: z.string().min(1, "Last name must not be empty"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must have 10 numbers")
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

export const registerAddressDTO = z.object({
  recipientName: z
    .string()
    .min(2, "username must have at least 2 characters")
    .trim(),

  recipientPhone: z
    .string()
    .regex(/^(0[3|5|7|8|9])([0-9]{8})$/, "Phone number must have 10 numbers"),

  streetAddress: z
    .string()
    .min(5, "Street Address must have at least 5 character")
    .trim(),

  city: z.string().min(1, "Please select City"),

  district: z.string().min(1, "Please select District"),

  ward: z.string().min(1, "Please select Ward"),

  isDefault: z.boolean().optional().default(false),
});

export const loginDTO = authBase;
