import express from "express";
import { connectDB } from "../db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  const db = await connectDB();

  const routers = await db.collection("router").find({}).toArray();
  res.json(routers);
});

router.post("/add", async (req, res) => {
  const { ip, username, password } = req.body;
  if (!ip || !username || !password)
    return res.status(400).json({ error: "ip, username, password required" });

  const db = await connectDB();
  const result = await db.collection("router").insertOne({
    ip,
    username,
    password,
  });

  res.json(result);
});

router.post("/edit", async (req, res) => {
  const { ip, username, password, object_id } = req.body;
  if (!ip || !username || !password || !object_id)
    return res
      .status(400)
      .json({ error: "ip, username, password, object_id required" });

  const db = await connectDB();
  const result = await db
    .collection("router")
    .updateOne(
      { _id: new ObjectId(object_id) },
      { $set: { ip, username, password } },
    );

  res.json(result);
});

router.post("/delete", async (req, res) => {
  const { object_id } = req.body;
  if (!object_id) return res.status(400).json({ error: "object_id required" });

  const db = await connectDB();
  const result = await db.collection("router").deleteOne({
    _id: new ObjectId(object_id),
  });

  res.json(result);
});

export default router;
