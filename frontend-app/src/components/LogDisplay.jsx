import React from "react";
import "../css/LogDisplay.css";

function LogDisplay({ title, logs }) {
  return (
    <div className="log-display">
      {/* <h3 className="log-title">{title}</h3> */}
      <div className="log-content">
        {logs.length > 0 ? (
          logs.map((log, i) => (
            <div key={i} className="log-line">
              {log}
            </div>
          ))
        ) : (
          <p className="log-empty">No logs available</p>
        )}
      </div>
    </div>
  );
}

export default LogDisplay;
