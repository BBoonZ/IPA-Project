import cron from "node-cron";
import { connectDB } from "./db.js";

async function rotateLogs() {
  const db = await connectDB();
  const logsCol = db.collection("logs");
  const logFilesCol = db.collection("log_files");

  const logs = await logsCol.find().toArray();
  if (logs.length === 0) {
    console.log(" No logs to rotate.");
    return;
  }

  // แยก log ตาม ip + category
  const grouped = {};
  for (const log of logs) {
    const categories = Array.isArray(log.category) ? log.category : [log.category];
    const logLine = log.timestamp + " " + log.message;

    // push log เข้าแต่ละ category
    for (const cat of categories) {
      const key = `${log.ip}_${cat}`;
      if (!grouped[key]) grouped[key] = { ip: log.ip, category: cat, messages: [] };
      grouped[key].messages.push(logLine);
    }
  }

  const timestamp = new Date();
  const dateLabel = timestamp.toISOString().replace(/[-:T.Z]/g, "").slice(0, 12);

  // เขียนไฟล์ log แยกตาม ip + category
  for (const { ip, category, messages } of Object.values(grouped)) {
    const safeCategory = category.replace(/\s+/g, "-");
    const filename = `File-${safeCategory}-${dateLabel}`;

    await logFilesCol.insertOne({
      ip,
      filename,
      category,
      created_at: timestamp,
      logs: messages,
    });
  }

  // ลบ log เดิมออก
  await logsCol.deleteMany({});
  console.log(`Log rotation complete for ${Object.keys(grouped).length} router/category group(s).`);
}

// ตั้ง cron job ทุก 2 ชั่วโมง (วินาที, นาที, ชั่วโมง)
// cron.schedule("*/30 * * * * *", () => {
//   console.log("rotateLogs triggered");
//   rotateLogs();
// });

console.log("Cron job initialized (every 2 hours)");
