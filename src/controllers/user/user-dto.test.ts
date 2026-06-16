import { describe, it, expect } from "vitest";
import { userResponseDto } from "./user-dto";

describe("userResponseDTO", () => {
  it("should strip out sensitive fields and return only the expected fields", () => {
    const mockDbUser = {
      id: 1,
      username: "HoangPham1",
      password: "hashedPassword123",
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { password, createdAt, updatedAt, ...expectedUser } = mockDbUser;

    const result = userResponseDto(mockDbUser);

    expect(result).toEqual(expectedUser);
  });
});
