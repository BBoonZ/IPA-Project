import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logsRouter from "./src/routes/logs.js";
import "./src/cron.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/logs", logsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
