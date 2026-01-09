import { ZodError } from "zod";

export const errorHandler = (err, req, res, next) => {
  console.log("Error Detected:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error!";

  if (err.code === "P2002") {
    statusCode = 409;
    message = "Duplicate record found";
  }

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Missing fields or invalid input!";
  }

  console.error(`Error: ${message}`);

  res.status(statusCode).json({
    status: "error",
    message: message,
  });
};
