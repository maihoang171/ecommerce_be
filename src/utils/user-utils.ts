import { prisma } from "../lib/prisma";
import { scryptSync, randomBytes } from "crypto";

// registration
export const findUserByUserName = async (userName: string) => {
  return await prisma.user.findUnique({
    where: { userName },
  });
};

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
};
