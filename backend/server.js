import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import githubRouter from "./routes/github.js";
import emailRouter from "./routes/email.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// --- 기존 GitHub API ---
app.use("/api/github", githubRouter);

// --- 새 이메일 API ---
app.use("/api/email", emailRouter);

app.listen(5001, () => console.log("Server running on port 5001"));
