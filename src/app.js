import express from "express";
import morgan from "morgan";
import router from "./routes/routes.js";
import { errorHandler } from "./middlewares/error.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: "http://localhost:5174",

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "welcom to Ecommerce API!",
    status: "running",
  });
});

app.use("/api/v1", router);

app.use(errorHandler);

export default app;
