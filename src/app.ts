import express from "express";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import router from "./router/routes";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "Welcome to E-commerce API", status: "running" });
});

app.use("/api/v1", router);
app.use(errorHandler);
export default app;
