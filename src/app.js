import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "welcom to Ecommerce API!",
        status: "running"
    });
});

export default app;