import { useState } from "react";
import LogDisplay from "../components/LogDisplay";
import "../css/RouterLog.css";

export default function RouterLog() {
  const [selected, setSelected] = useState("Centralized log");
  const [selectedFile, setSelectedFile] = useState("");

  const [showFiles, setShowFiles] = useState(false);

  const categories = [
    "Centralized log",
    "Interface log",
    "Security log",
    "DHCP log",
    "DNS log",
    "Config log",
  ];

  const allLogs = {
    "Centralized log": [
      "[INFO] Router system initialized",
      "[WARNING] CPU usage high (87%)",
    ],
    "Interface log": ["[INTERFACE] eth0 link up", "[INTERFACE] eth1 down"],
    "Security log": ["[ERROR] Firewall dropped packet from 10.0.0.5"],
    "DHCP log": ["[DHCP] Lease granted to 192.168.1.15"],
    "DNS log": ["[DNS] Request www.google.com → 142.250.196.14"],
    "Config log": ["[CONFIG] Updated routing table"],
  };

  const allLogFiles = {
    "File-Centralized-log-10152025-0146": [
      "[INFO] Router system initialized",
      "[WARNING] CPU usage high (87%)",
    ],
    "File-Interface-log-10152025-0146": [
      "[INTERFACE] eth0 link up",
      "[INTERFACE] eth1 down",
    ],
    "File-Security-log-10152025-0146": [
      "[ERROR] Firewall dropped packet from 10.0.0.5",
    ],
    "File-DHCP-log-10152025-0146": [
      "[DHCP] Lease granted to 192.168.1.15",
    ],
    "File-DNS-log-10152025-0146": [
      "[DNS] Request www.google.com → 142.250.196.14",
    ],
    "File-Config-log-10152025-0146": ["[CONFIG] Updated routing table"],
  };

  //ถ้ามีไฟล์เลือกแล้วให้แสดง logs จากไฟล์นั้น ถ้าไม่เลือกให้แสดง log ปัจจุบัน
  const displayLogs =
    selectedFile && allLogFiles[selectedFile]
      ? allLogFiles[selectedFile]
      : allLogs[selected] || [];

 // Download Selected File
  const handleDownload = async () => {
    try {
      const name = selectedFile || selected;
      const res = await fetch(`/api/${name}`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.log`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("❌ Error downloading log: " + err.message);
    }
  };

  return (
    <div className="everylog-container">
      <h1 className="everylog-title">EveryLog</h1>
      <h3 className="router-ip">Router IP: 192.168.1.1</h3>
      <div className="everylog-layout">
        {/* Sidebar */}
        <div className="sidebar">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`sidebar-item ${selected === cat ? "active" : ""}`}
              onClick={() => {
                setSelected(cat);
                setSelectedFile("");
              }}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Main Area */}
        <div className="main-area">
          <div className="main-header">
            <div className="header-log">{selected}</div>
            <div>
              <button className="header-btn" onClick={handleDownload}>
                <i className="fa-solid fa-download"></i> Download
              </button>
              <button className="header-btn" onClick={() => setShowFiles(!showFiles)}>
                <i className="fa-solid fa-folder-open"></i> File
              </button>
            </div>
          </div>

          {/* Log display */}
          <LogDisplay title={selectedFile || selected} logs={displayLogs} />

          {/* [selected] */}
        </div>

        {/* File Area */}
        {showFiles && (
          <div className="file-area">
            <div className="file-sidebar">
              <h3>Saved Logs</h3>
              {Object.keys(allLogFiles).map((file) => (
                <div
                  key={file}
                  className={`file-item ${selectedFile === file ? "active" : ""}`}
                  onClick={() => {
                    setSelectedFile(file);
                    setSelected(file);
                  }}
                >
                  <i className="fa-solid fa-file-lines"></i> {file}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
