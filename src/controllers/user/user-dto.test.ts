import { describe, it, expect } from "vitest";
import { userResponseDto } from "./user-dto";

describe("userResponseDTO", () => {
  it("should strip out sensitive fields and return only the expected fields", () => {
    const mockDbUser = {
      id: 1,
      userName: "HoangPham1",
      password: "hassPassword123",
      firstName: "Hoang",
      lastName: "Pham",
      phoneNumber: "0954908928",
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { password, createdAt, updatedAt, ...expectedUser } = mockDbUser;

    const result = userResponseDto(mockDbUser);

    expect(result).toEqual(expectedUser);
  });
});
