import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express-serve-static-core";
import { authenticateJwt } from "../middlewares/authenticateJwt";
import { sendError } from "../utils/response-utils"
import jwt from "jsonwebtoken"
import type { JwtUserPayload } from "../middlewares/authenticateJwt";

vi.mock("../utils/response-utils", () => ({
    sendError: vi.fn()
}))
vi.mock("jsonwebtoken", () => ({
    default: {
        verify: vi.fn()
    }
}))

describe("authenticateJwt", () => {
    const TEST_SECRET = "my-jwt-secret"

    beforeEach(() => {
        vi.resetAllMocks()

        vi.stubEnv("JWT_SECRET", TEST_SECRET)
    })

    const mockReq = {
        cookies: {},
        user: undefined
    } as unknown as Request & { user?: JwtUserPayload }
    const mockRes = {} as Response
    const mockNext = vi.fn()


    it("should return status code 401 and message when token is missing", () => {
        authenticateJwt(mockReq, mockRes, mockNext)
        expect(sendError).toHaveBeenCalledWith(mockRes, 401, "Token is missing. Please login again!")
    })

    it("should verify the token and call next when token is valid", () => {
        const mockUser = {
            id: 1,
            userName: "testUser",
            isAdmin: false
        } as JwtUserPayload

        mockReq.cookies.accessToken = "valid.git.token";

        (jwt.verify as any).mockReturnValue(mockUser)

        authenticateJwt(mockReq, mockRes, mockNext)
        expect(jwt.verify).toHaveBeenCalledWith(mockReq.cookies.accessToken, TEST_SECRET)
        expect(mockReq.user).toEqual(mockUser)
        expect(mockNext).toHaveBeenCalled()
    })
    it("should return status code 401 and message when token is invalid", () => {
        mockReq.cookies.accessToken = "invalid.git.token";

        (jwt.verify as any).mockImplementation(() => {
            throw new Error("Invalid token")
        })

        authenticateJwt(mockReq, mockRes, mockNext)
        expect(sendError).toHaveBeenCalledWith(mockRes, 401, "Invalid token. Please login again!")
    })
})
