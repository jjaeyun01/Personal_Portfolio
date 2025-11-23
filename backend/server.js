import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import githubRouter from "./routes/github.js";

dotenv.config();

console.log("SERVER READ TOKEN RAW:", JSON.stringify(process.env.GITHUB_TOKEN));

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

app.use("/api/github", githubRouter);

app.listen(5001, () => console.log("Server running on port 5001"));
