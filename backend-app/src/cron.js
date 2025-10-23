import cron from "node-cron";
import { connectDB } from "./db.js";

async function rotateLogs() {
  const db = await connectDB();
  const logsCol = db.collection("logs");
  const logFilesCol = db.collection("log_files");

  const logs = await logsCol.find().toArray();
  if (logs.length === 0) {
    console.log("ℹ️ No logs to rotate.");
    return;
  }

  //แยก log ตาม ip + category
  const grouped = {};
  for (const log of logs) {
    const key = `${log.ip}_${log.category}`;
    if (!grouped[key]) grouped[key] = { ip: log.ip, category: log.category, messages: [] };
    grouped[key].messages.push(log.message);
  }

  const timestamp = new Date();
  const dateLabel = timestamp
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 12);

  for (const { ip, category, messages } of Object.values(grouped)) {
    const safeCategory = category.replace(/\s+/g, "-");
    // const safeIP = ip.replace(/\./g, "-");
    const filename = `File-${safeCategory}-${dateLabel}`;

    await logFilesCol.insertOne({
      ip,
      filename,
      category,
      created_at: timestamp,
      logs: messages,
    });
  }

  await logsCol.deleteMany({});
  console.log(`Log rotation complete for ${Object.keys(grouped).length} router(s)`);
}

// ตั้ง cron job ทุก 2 ชั่วโมง 00:00 02:00 04:00 06:00
// cron.schedule("* */2 * * * *", () => {
//   console.log("🔄 rotateLogs triggered");
//   rotateLogs();
// });
console.log("Cron job initialized (every 2 hours)");
