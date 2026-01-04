import { ZodError } from "zod";

export const errorHandler = (err, req, res, next) => {
  console.log("Error Detected:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error!";
  let errors = [];

  if (err.code === "P2002") {
    statusCode = 409;
    message = "Duplicate record found";
    errors = [
      {
        field: err.meta?.target?.join(", "),
        message: "This value is already in use",
      },
    ];
  }
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Missing fields or invalid input!";
    errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }

  console.error(`Error: ${message}`);

  res.status(statusCode).json({
    status: "error",
    message: message,
    errors: errors.length > 0 ? errors : undefined,
  });
};
