import express from "express";
import morgan from "morgan";
import router from "./routes/routes.js";
import { errorHandler } from "./middlewares/error.js";

const app = express();

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
