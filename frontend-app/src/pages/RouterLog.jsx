import { useState } from "react";
import "../css/RouterLog.css";

export default function RouterLog() {
  const [filter, setFilter] = useState("All");

  const logs = [
    { ip: "192.168.1.1", status: "Connected", time: "2025-10-14 14:30" },
    { ip: "192.168.1.2", status: "Failed", time: "2025-10-14 14:32" },
    { ip: "192.168.1.3", status: "Connecting", time: "2025-10-14 14:35" },
  ];

  const filteredLogs = logs.filter(
    (log) => filter === "All" || log.status === filter
  );

  return (
    <div className="log-page">
      <header>
        <h1>EveryLog Router Dashboard</h1>
        <h2>Router Status Logs</h2>
      </header>

      <div className="filter">
        <label>Filter Status: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Connected">Connected</option>
          <option value="Failed">Failed</option>
          <option value="Connecting">Connecting</option>
        </select>
      </div>

      <div className="log-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>IP Address</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{log.ip}</td>
                  <td
                    className={
                      log.status === "Connected"
                        ? "status connected"
                        : log.status === "Failed"
                        ? "status failed"
                        : "status connecting"
                    }
                  >
                    {log.status}
                  </td>
                  <td>{log.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
