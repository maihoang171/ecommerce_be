import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const registerService = async (userData) => {
  const { username, password, firstName, lastName, phoneNumber } = userData;
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

export const loginService = async (userData) => {
  const { username, password } = userData;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  const isMatch = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !isMatch) {
    const error = new Error("Invalid username or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    user: user,
    accessToken: token,
  };
};

export const getMeService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
};

export const createAddressService = async (userId, addressData) => {
  const {
    recipientName,
    recipientPhone,
    streetAddress,
    city,
    district,
    ward,
    isDefault,
  } = addressData;

  const addressCount = await prisma.userAddress.count({
    where: { userId: userId },
  });

  let finalDefaultStatus = isDefault || false;

  if (addressCount === 0) {
    finalDefaultStatus = true;
  }

  if (finalDefaultStatus && addressCount > 0) {
    await prisma.userAddress.updateMany({
      where: { id: userId },
      data: { isDefault: false },
    });
  }

  const newAddress = await prisma.userAddress.create({
    data: {
      userId: userId,
      recipientName,
      recipientPhone,
      streetAddress,
      city,
      district,
      ward,
      isDefault: finalDefaultStatus,
    },
  });

  return newAddress;
};
