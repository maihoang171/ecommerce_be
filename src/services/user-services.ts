import type { User } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../utils/user-utils";
import { addDays } from "date-fns";

export const findUserByUserName = async (userName: string) => {
  return await prisma.user.findUnique({
    where: { userName },
  });
};

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
  });

  return newUser;
};

export const loginService = async (userName: string, password: string) => {
  const user = await findUserByUserName(userName);
  if (!userName) {
    let error = new Error("User not found") as Error & { statusCode: number };
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = verifyPassword(password, user.password);

  if (!isPasswordValid) {
    let error = new Error("Incorrect password") as Error & {
      statusCode: number;
    };
    error.statusCode = 401;
    throw error;
  }

  return user;
};

export const createRefreshTokenService = async (
  userId: number,
  refreshToken: string,
) => {
  const expiredAt = addDays(new Date(), 7);

  await prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });

  return await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiredAt,
    },
  });
};
