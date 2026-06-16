import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { createHash } from "crypto";

// ----------------registration
export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
};

export const verifyPassword = (password: string, hashedPassword: string) => {
  const [salt, originalDerivedKey] = hashedPassword.split(":");

  if (!salt || !originalDerivedKey) return false;

  const derivedKey = scryptSync(password, salt, 64).toString("hex");

  //Avoid timing attack
  const originalDerivedKeyBuffer = Buffer.from(originalDerivedKey, "hex");
  const derivedKeyBuffer = Buffer.from(derivedKey, "hex");

  return timingSafeEqual(originalDerivedKeyBuffer, derivedKeyBuffer);
};

export const hashToken = (token: string) => {
  return createHash("sha256").update(token).digest("hex");
};
