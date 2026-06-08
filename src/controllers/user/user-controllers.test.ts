import { describe, it, vi, expect, beforeEach } from "vitest";
import { baseUserSchema } from "../../schemas/authSchema";
import {
  registerService,
  loginService,
  findUserByIdService,
  verifyRefreshTokenService,
} from "../../services/auth-services";
import {
  registerController,
  loginController,
  getMeController,
  refreshTokenController,
} from "./user-controllers";
import { sendAuthSuccess, sendError, sendSuccess } from "../../utils/response-utils";
import { userResponseDto } from "./user-dto";
import {
  generateAndSetAccessToken,
  generateAndSetRefreshToken,
} from "../../utils/token-utils";
import jwt from "jsonwebtoken";

vi.mock("../../services/auth-services", () => ({
  registerService: vi.fn(),
  loginService: vi.fn(),
  findUserByIdService: vi.fn(),
  verifyRefreshTokenService: vi.fn(),
}));

vi.mock("../../controllers/user/user-dto", () => ({
  registerUserSchema: {
    parse: vi.fn(),
  },
  userResponseDto: vi.fn((user) => user),
  baseUserSchema: {
    parse: vi.fn(),
  },
}));

vi.mock("../../utils/response-utils", () => ({
  sendSuccess: vi.fn(),
  sendError: vi.fn(),
  sendAuthSuccess: vi.fn(),
}));

vi.mock("../../utils/token-utils", () => ({
  generateAndSetAccessToken: vi.fn(),
  generateAndSetRefreshToken: vi.fn(),
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));

describe("registerController", () => {
  const mockValidUserData = {
    userName: "HoangPham1",
    password: "HoangPham123",
  };

  const mockNewUser = {
    id: 1,
    ...mockValidUserData,
    isAdmin: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return status code 201, message and user data on success", async () => {
    const mockReq = {
      body: mockValidUserData,
    };
    const mockRes = {};
    const mockNext = vi.fn();

    vi.spyOn(baseUserSchema as any, "parse").mockReturnValue(mockValidUserData);
    vi.mocked(registerService).mockResolvedValue(mockNewUser);

    await registerController(mockReq as any, mockRes as any, mockNext);

    expect(baseUserSchema.parse).toHaveBeenCalledWith(mockValidUserData);
    expect(registerService).toHaveBeenCalledWith(mockValidUserData);
    expect(sendSuccess).toHaveBeenCalledWith(
      mockRes,
      201,
      userResponseDto(mockNewUser),
    );
  });

  // it("should fallback phone number to empty string if it is not provided", async () => {
  //   const { phoneNumber, ...mockValidUserDataWithoutPhone } = mockValidUserData;
  //   const mockReq = {
  //     body: {
  //       mockValidUserDataWithoutPhone,
  //     },
  //   };
  //   const mockRes = {};
  //   const mockNext = vi.fn();

  //   vi.spyOn(baseUserSchema as any, "parse").mockReturnValue(
  //     mockValidUserDataWithoutPhone,
  //   );
  //   vi.mocked(registerService).mockResolvedValue({
  //     ...mockNewUser,
  //     phoneNumber: "",
  //   });

  //   await registerController(mockReq as any, mockRes as any, mockNext);

  //   expect(baseUserSchema.parse).toHaveBeenCalledWith(mockReq.body);
  //   expect(registerService).toHaveBeenCalledWith({
  //     ...mockValidUserDataWithoutPhone,
  //     phoneNumber: "",
  //   });
  // });

  it("should call next on zod validation error", async () => {
    const mockReq = {
      body: mockValidUserData,
    };
    const mockRes = {};
    const mockNext = vi.fn();

    const mockZodError = new Error("Zod validation error");

    vi.spyOn(baseUserSchema as any, "parse").mockImplementation(() => {
      throw mockZodError;
    });

    await registerController(mockReq as any, mockRes as any, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockZodError);
  });

  it("should call next on service error", async () => {
    const mockReq = {
      body: mockValidUserData,
    };
    const mockRes = {};
    const mockNext = vi.fn();

    const mockServiceError = new Error("Service error");

    vi.spyOn(baseUserSchema as any, "parse").mockReturnValue(mockValidUserData);
    vi.mocked(registerService).mockImplementation(() => {
      throw mockServiceError;
    });

    await registerController(mockReq as any, mockRes as any, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockServiceError);
  });
});

describe("loginController", () => {
  const mockValidInput = {
    userName: "HoangPham1",
    password: "HoangPham123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call next on zod validation error", async () => {
    const mockReq = {
      body: mockValidInput,
    };
    const mockRes = {};
    const mockNext = vi.fn();

    const mockZodError = new Error("Zod validation error");

    vi.spyOn(baseUserSchema as any, "parse").mockImplementation(() => {
      throw mockZodError;
    });

    await loginController(mockReq as any, mockRes as any, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockZodError);
  });

  it("should call next on service error", async () => {
    const mockReq = {
      body: mockValidInput,
    };
    const mockRes = {};
    const mockNext = vi.fn();

    const mockServiceError = new Error("Service error");

    vi.spyOn(baseUserSchema as any, "parse").mockReturnValue(mockValidInput);
    vi.mocked(loginService).mockRejectedValue(mockServiceError);

    await loginController(mockReq as any, mockRes as any, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockServiceError);
  });

  it("should return status code 401 and error message on invalid username or password", async () => {
    const mockReq = {
      body: mockValidInput,
    };
    const mockRes = {};
    const mockNext = vi.fn();

    vi.spyOn(baseUserSchema as any, "parse").mockReturnValue(mockValidInput);

    vi.mocked(loginService).mockResolvedValue(null);

    await loginController(mockReq as any, mockRes as any, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      401,
      "Invalid username or password",
    );
  });

  it("should generate tokens, set them in cookie, return status code 200 and user data on successfully login", async () => {
    const mockReq = {
      body: mockValidInput,
    };
    const mockRes = {};
    const mockNext = vi.fn();

    const mockUser = {
      id: 1,
      userName: "HoangPham1",
      isAdmin: false,
    };

    vi.spyOn(baseUserSchema as any, "parse").mockReturnValue(mockValidInput);

    vi.mocked(loginService).mockResolvedValue(mockUser);

    await loginController(mockReq as any, mockRes as any, mockNext);

    const accessToken = await generateAndSetAccessToken(mockUser);

    expect(generateAndSetAccessToken).toHaveBeenCalledWith(mockUser);
    expect(generateAndSetRefreshToken).toHaveBeenCalledWith(mockRes, mockUser);

    expect(sendAuthSuccess).toHaveBeenCalledWith(
      mockRes,
      200,
      accessToken,
      userResponseDto(mockUser),
    );
  });
});

describe("getMeController", () => {
  const mockUser = {
    id: 1,
    userName: "HoangPham1",
    isAdmin: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error on unauthorized access", async () => {
    const mockReq = {
      user: null,
    };
    const mockRes = {};
    const mockNext = vi.fn();

    await getMeController(mockReq as any, mockRes as any, mockNext);
    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      401,
      "Unauthorized access. Please login again!",
    );
  });

  it("should call next on service error", async () => {
    const mockReq = {
      user: mockUser,
    };
    const mockRes = {};
    const mockNext = vi.fn();

    const mockServiceError = new Error("Service error");

    vi.mocked(findUserByIdService).mockRejectedValue(mockServiceError);
    await getMeController(mockReq as any, mockRes as any, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockServiceError);
  });

  it("should return status code 404 and error message on user no longer exists", async () => {
    const mockReq = {
      user: mockUser,
    };
    const mockRes = {};
    const mockNext = vi.fn();

    vi.mocked(findUserByIdService).mockResolvedValue(null);

    await getMeController(mockReq as any, mockRes as any, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      404,
      "User no longer exists. Please login again!",
    );
  });

  it("should return status code 200 and user data on successfully", async () => {
    const mockReq = {
      user: mockUser,
    };
    const mockRes = {};
    const mockNext = vi.fn();

    const mockUserResponse = {
      ...mockUser,
    };

    vi.mocked(findUserByIdService).mockResolvedValue(mockUserResponse);
    await getMeController(mockReq as any, mockRes as any, mockNext);

    expect(sendSuccess).toHaveBeenCalledWith(
      mockRes,
      200,
      userResponseDto(mockUserResponse),
    );
  });
});

describe("refreshTokenController", () => {
  const mockReq = {
    cookies: {},
  } as any;
  const mockRes = {} as any;
  const mockNext = vi.fn();

  const mockUser = {
    id: 1,
    userName: "HoangPham1",
    isAdmin: false,
  };

  it("should return status code 401 and message on missing refresh token", () => {
    refreshTokenController(mockReq, mockRes, mockNext);
    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      401,
      "Refresh token is missing. Please login again!",
    );
  });

  it("should return status code 401 and message on invalid refresh token or session expired", async () => {
    mockReq.cookies.refreshToken = "expired-or-revoked-token";

    vi.mocked(jwt.verify).mockReturnValue(mockUser as any);

    vi.mocked(verifyRefreshTokenService).mockResolvedValue(false);

    await refreshTokenController(mockReq, mockRes, mockNext);

    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      401,
      "Invalid refresh token or session expired. Please login again!",
    );
  });

  it("should return status code 404 and message on user no longer exists", async () => {
    mockReq.cookies.refreshToken = "valid-token";
    vi.mocked(jwt.verify).mockReturnValue(mockUser as any);
    vi.mocked(verifyRefreshTokenService).mockResolvedValue(true);
    vi.mocked(findUserByIdService).mockResolvedValue(null);

    await refreshTokenController(mockReq, mockRes, mockNext);
    expect(sendError).toHaveBeenCalledWith(
      mockRes,
      404,
      "User no longer exists. Please login again!",
    );
  });

  it("should return status code 200 and user data, generate tokens, set them in cookie on successfully", async () => {
    mockReq.cookies.refreshToken = "valid-token";
    vi.mocked(jwt.verify).mockReturnValue(mockUser as any);
    vi.mocked(verifyRefreshTokenService).mockResolvedValue(true);
    vi.mocked(findUserByIdService).mockResolvedValue(mockUser);

    await refreshTokenController(mockReq, mockRes, mockNext);

    const mockUserResponse = {
      ...mockUser,
    };

    const accessToken = await generateAndSetAccessToken(mockUser);
    expect(generateAndSetAccessToken).toHaveBeenCalledWith(mockUser);
    expect(generateAndSetRefreshToken).toHaveBeenCalledWith(mockRes, mockUser);
    expect(sendAuthSuccess).toHaveBeenCalledWith(
      mockRes,
      200,
      accessToken,
      userResponseDto(mockUserResponse),
    );
  });

  it("should call next on service error", async () => {
    const mockServiceError = new Error("Service error");

    mockReq.cookies.refreshToken = "valid-token";
    vi.mocked(jwt.verify).mockReturnValue(mockUser as any);
    vi.mocked(verifyRefreshTokenService).mockRejectedValue(mockServiceError);

    await refreshTokenController(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockServiceError);
  });
});
