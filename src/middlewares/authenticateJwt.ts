import type {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/response-utils";

export interface JwtUserPayload {
  id: number;
  userName: string;
  isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jwtSecret = process.env.JWT_SECRET!;
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return sendError(res, 401, "Token is missing. Please login again!");
    }
    const decoded = jwt.verify(accessToken, jwtSecret);
    req.user = decoded as JwtUserPayload;
    next();
  } catch (error) {
    return sendError(res, 401, "Invalid token. Please login again!");
  }
};
