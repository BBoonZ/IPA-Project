import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LogDisplay from "../components/LogDisplay";
import "../css/RouterLog.css";

export default function RouterLog() {
  const { ip } = useParams();
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

  const [allLogs, setAllLogs] = useState({
    "Centralized log": [],
    "Interface log": [],
    "Security log": [],
    "DHCP log": [],
    "DNS log": [],
    "Config log": [],
  });

  useEffect(() => {
    const fetchLogs = () => {
      fetch(`http://localhost:4000/api/logs?ip=${ip}`)
        .then((res) => res.json())
        .then((data) => {
          const newLogs = {
            "Centralized log": [],
            "Interface log": [],
            "Security log": [],
            "DHCP log": [],
            "DNS log": [],
            "Config log": [],
          };

          data.forEach((log) => {
            // ตรวจว่าหมวดเป็น array หรือไม่
            const categories = Array.isArray(log.category)
              ? log.category
              : [log.category];

            categories.forEach((cat) => {
              if (newLogs[cat]) {
                newLogs[cat].push(log.message);
              } else {
                newLogs[cat] = [log.message];
              }
            });
          });

          setAllLogs(newLogs);
        })
        .catch((err) => console.error("Fetch error:", err));
    };

    fetchLogs(); // fetch ครั้งแรก
    const interval = setInterval(fetchLogs, 20000); // fetch ทุก 20 วินาที

    return () => clearInterval(interval); // ล้าง interval เวลา component unmount
  }, [ip]);

  const [allLogFiles, setAllLogFiles] = useState({});

  useEffect(() => {
    const fetchLogs = () => {
      fetch(`http://localhost:4000/api/logs/file?ip=${ip}`)
        .then((res) => res.json())
        .then((data) => {
          // สร้าง object ใหม่โดยใช้ filename เป็น key และ logs เป็น value
          const newLogFiles = {};

          data.forEach((logFile) => {
            newLogFiles[logFile.filename] = logFile.logs;
          });

          setAllLogFiles(newLogFiles);
        })
        .catch((err) => console.error("Fetch error:", err));
    };

    fetchLogs(); // fetch ครั้งแรก
    const interval = setInterval(fetchLogs, 20000); // fetch ทุก 20 วินาที

    return () => clearInterval(interval); // ล้าง interval เวลา component unmount
  }, []);

  const displayLogs =
    selectedFile && allLogFiles[selectedFile]
      ? allLogFiles[selectedFile]
      : allLogs[selected] || [];

  // Download Selected File
  const handleDownload = () => {
    try {
      if (!displayLogs || displayLogs.length === 0) {
        alert("❌ No logs to download");
        return;
      }

      const name = selectedFile || selected || "logs";

      const text = displayLogs.join("\n");

      const blob = new Blob([text], { type: "text/plain" });
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
      <h1 className="everylog-title">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          EveryLog
        </Link>
      </h1>
      <h3 className="router-ip">Router IP: {ip}</h3>
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
              <button
                className="header-btn"
                onClick={() => setShowFiles(!showFiles)}
              >
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
