import { it, expect, describe, vi } from "vitest";
import { hashPassword, verifyPassword } from "./user-utils";
import { beforeEach } from "node:test";

describe("hashPassword", () => {
  const mockedPassword = "MockedPassword123";
  const hashedPassword = hashPassword(mockedPassword);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a string split by a colon delimiter", () => {
    expect(hashedPassword).toContain(":");
    expect(typeof hashedPassword).toBe("string");
  });

  it("should return 32 characters hex string for the salt", () => {
    let [salt] = hashedPassword.split(":");

    expect(salt?.length).toBe(32);
    expect(salt).toMatch(/^[0-9a-f]+$/);
  });

  it("should return 128 characters hex string for the derived key", () => {
    let [, derivedKey] = hashedPassword.split(":");
    expect(derivedKey?.length).toBe(128);
    expect(derivedKey).toMatch(/^[0-9a-f]+$/);
  });

  it("should output the completely different hashes when given the same password", () => {
    const anotherHashedPassword = hashPassword(mockedPassword);
    expect(hashedPassword).not.toEqual(anotherHashedPassword);
  });
});

describe("verifyPassword", () => {
  const mockedPassword = "MockedPassword123";
  const hashedPassword = hashPassword(mockedPassword);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return true when the password matches the hashed password", () => {
    const result = verifyPassword(mockedPassword, hashedPassword);
    expect(result).toBe(true);
  });

  it("should return false when the salt or derived key are missing", () => {
    const salt = "";
    const derivedKey = "";
    const result = verifyPassword(mockedPassword, `${salt}:${derivedKey}`);

    expect(result).toBe(false);
  });

  it("should return false when the password does not match the hashed password", () => {
    const anotherPassword = "AnotherPassword123";
    const result = verifyPassword(anotherPassword, hashedPassword);

    expect(result).toBe(false);
  });
});
