import type {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/custom-errors";

export interface JwtUserPayload {
  id: number;
  username: string;
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

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token is missing or invalid format.");
    }

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      throw new UnauthorizedError("Token is missing or invalid format.");
    }

    const decoded = jwt.verify(accessToken, jwtSecret);
    req.user = decoded as JwtUserPayload;

    next();
  } catch (error) {
    next(
      new UnauthorizedError("Invalid or expired token. Please login again."),
    );
  }
};
