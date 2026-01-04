import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
export const registerUserService = async (userData) => {
  const { username, password, firstName, lastName, phoneNumber } = userData;
  console.log(userData);
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    const error = new Error(
      "User registration failed: username already exists"
    );
    error.statusCode = 409;
    throw error;
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      role: "customer",
    },

    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      phoneNumber: true,
      createdAt: true,
    },
  });

  return newUser;
};
