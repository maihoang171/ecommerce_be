import type { User } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { findUserByUserName, hashPassword } from "../utils/user-utils";

export const registerService = async (
  user: Pick<
    User,
    "userName" | "password" | "firstName" | "lastName" | "phoneNumber"
  >,
) => {
  const { userName, password, firstName, lastName, phoneNumber } = user;

  const existingUser = await findUserByUserName(userName);
  if (existingUser) {
    let error = new Error(
      "User registration failed: username already exists",
    ) as Error & { statusCode: number };
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      userName,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
    },
    select: {
      id: true,
      userName: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
    },
  });

  return newUser;
};
