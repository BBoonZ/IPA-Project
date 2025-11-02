import express from "express";
import { connectDB } from "../db.js";

const router = express.Router();

// ดึง logs ทั้งหมด (option: filter ตาม ip)
router.get("/", async (req, res) => {
  const db = await connectDB();
  const { ip } = req.query;

  const filter = ip ? { ip } : {};
  const logs = await db.collection("router_log").find(filter).toArray();
  res.json(logs);
});

// ดึง logFile ตาม ip
router.get("/file", async (req, res) => {
  const db = await connectDB();
  const { ip } = req.query;
  if (!ip) {
    return res.status(400).json({ error: "IP is required" });
  }

  const filter = ip ? { ip } : {};
  const log_files = await db.collection("log_files").find(filter).toArray();
  res.json(log_files);
});

// เพิ่ม log ใหม่
router.post("/", async (req, res) => {
  const { ip, category, message } = req.body;
  if (!ip || !category || !message)
    return res.status(400).json({ error: "ip, category, message required" });

  const db = await connectDB();
  const result = await db.collection("router_log").insertOne({
    ip,
    category,
    message,
    timestamp: new Date(),
  });

  res.json(result);
});

export default router;
