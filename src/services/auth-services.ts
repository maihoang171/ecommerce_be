import type { User } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { hashPassword, hashToken, verifyPassword } from "../utils/user-utils";
import { addDays } from "date-fns";
import { ConflictError, UnauthorizedError } from "../utils/custom-errors-utils";

export const findUserByUsernameService = async (username: string) => {
  return await prisma.user.findUnique({
    where: { username },
  });
};

export const findUserByIdService = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const registerService = async (
  user: Pick<User, "username" | "password">,
) => {
  const { username, password } = user;

  const existingUser = await findUserByUsernameService(username);

  if (existingUser) {
    throw new ConflictError("Username already exists");
  }

  const hashedPassword = hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  return newUser;
};

export const loginService = async (username: string, password: string) => {
  const user = await findUserByUsernameService(username);

  const invalidMsg = "Invalid username or password";

  if (!user) {
    throw new UnauthorizedError(invalidMsg);
  }

  const isPasswordValid = verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError(invalidMsg);
  }

  return user;
};

export const createRefreshTokenService = async (
  userId: number,
  refreshToken: string,
) => {
  const expiredAt = addDays(new Date(), 7);

  const hashedToken = hashToken(refreshToken);

  await prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });

  return await prisma.refreshToken.create({
    data: {
      userId,
      token: hashedToken,
      expiredAt,
    },
  });
};

export const verifyRefreshTokenService = async (
  userId: number,
  incomingRefreshToken: string,
) => {
  const hashedToken = hashToken(incomingRefreshToken);

  const refreshTokenFromDB = await prisma.refreshToken.findFirst({
    where: {
      userId,
      token: hashedToken,
    },
  });

  if (!refreshTokenFromDB) {
    return false;
  }

  return refreshTokenFromDB.expiredAt >= new Date();
};

export const logoutService = async (userId: number) => {
  return await prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });
};
