import { useEffect, useState } from "react";

function Test() {
  const [allLogs, setAllLogs] = useState({
    "Centralized log": [],
    "Interface log": [],
    "Security log": [],
    "DHCP log": [],
    "DNS log": [],
    "Config log": [],
  });

  useEffect(() => {
    fetch("http://localhost:4000/api/logs?ip=192.168.1.1")
      .then((res) => res.json())
      .then((data) => {
        // สร้าง copy ของ allLogs ปัจจุบัน
        const updatedLogs = { ...allLogs };

        // วนข้อมูลจาก API แล้วเพิ่ม message เข้า category ที่ตรงกัน
        data.forEach((log) => {
          if (updatedLogs[log.category]) {
            updatedLogs[log.category].push(log.message);
          } else {
            // ถ้า category ใหม่ไม่อยู่ใน allLogs ก็สร้าง array ใหม่
            updatedLogs[log.category] = [log.message];
          }
        });

        setAllLogs(updatedLogs);
      })
      .catch((err) => {
        console.error("Failed to fetch logs:", err);
      });
  }, []); // รันแค่ครั้งแรก

  return (
    <div>
      <h2>Logs</h2>
      <pre>{allLogs["Centralized log"]}</pre>
    </div>
  );
}

export default Test;
