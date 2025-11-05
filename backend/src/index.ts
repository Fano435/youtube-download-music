import express from "express";
import cors from "cors";
import convertRoute from "./routes/convert.js";

const app = express();
const port = 3000;

app.use(
    cors({
        exposedHeaders: ["Content-Disposition"],
    })
);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/convert", convertRoute);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
