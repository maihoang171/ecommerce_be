import type {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";
import { ZodError } from "zod";

type ErrorWithStatusCode = Error & { statusCode: number; code?: string };

export const errorHandler = (
  err: ErrorWithStatusCode,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Error detected: ", err);
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.code === "P2002") {
    statusCode = 409;
    message = "Duplicate record found";
  }

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Missing fields or invalid input";
  }
  
  console.error(`Error: ${message}`);
  res.status(statusCode).json({
    status: "error",
    message,
  });
};
