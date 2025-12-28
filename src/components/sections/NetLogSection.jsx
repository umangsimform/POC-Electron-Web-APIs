import { useState } from "react";
import {
  sectionStyle,
  headerStyle,
  apiLabelStyle,
  descriptionStyle,
  buttonContainerStyle,
  buttonStyle,
  secondaryButtonStyle,
  infoBoxStyle,
  successBoxStyle,
} from "./sharedStyles";

const NetLogSection = () => {
  const [netLogStatus, setNetLogStatus] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  const makeNetRequest = async () => {
    setNetLogStatus("Making request...");
    const result = await window.electronAPI?.netRequest({
      url: "https://api.github.com/zen",
      method: "GET",
    });
    if (result?.success) {
      setNetLogStatus(`Response: ${result.data?.substring(0, 100)}...`);
    } else {
      setNetLogStatus(`Error: ${result?.error || "Failed"}`);
    }
    setTimeout(() => setNetLogStatus(""), 5000);
  };

  const startNetLog = async () => {
    const result = await window.electronAPI?.netLogStartLogging(
      "/tmp/net-log.txt"
    );
    if (result?.success) {
      setNetLogStatus("NetLog started: /tmp/net-log.txt");
      setIsLogging(true);
    } else {
      setNetLogStatus(`Error: ${result?.error || "Failed"}`);
    }
    setTimeout(() => setNetLogStatus(""), 3000);
  };

  const stopNetLog = async () => {
    const result = await window.electronAPI?.netLogStopLogging();
    if (result?.success) {
      setNetLogStatus(`NetLog stopped: ${result.path}`);
      setIsLogging(false);
    } else {
      setNetLogStatus(`Error: ${result?.error || "Failed"}`);
    }
    setTimeout(() => setNetLogStatus(""), 5000);
  };

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>🌐 Net & NetLog</h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> net.request(), netLog.startLogging(),
        netLog.stopLogging(), ClientRequest
      </div>

      <p style={descriptionStyle}>
        Comprehensive network request capabilities and logging infrastructure.
        Make HTTP/HTTPS requests with full control, while network logging
        captures detailed traffic information for debugging, monitoring, and
        security auditing. Invaluable for troubleshooting connectivity and API
        integrations.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={makeNetRequest}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
          }}
        >
          📡 Make HTTP Request
        </button>
        <button
          onClick={startNetLog}
          disabled={isLogging}
          style={{
            ...(isLogging ? secondaryButtonStyle : buttonStyle),
            opacity: isLogging ? 0.5 : 1,
            cursor: isLogging ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!isLogging) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLogging) {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
            }
          }}
        >
          ▶️ Start NetLog
        </button>
        <button
          onClick={stopNetLog}
          disabled={!isLogging}
          style={{
            ...secondaryButtonStyle,
            opacity: isLogging ? 1 : 0.5,
            cursor: isLogging ? "pointer" : "not-allowed",
          }}
          onMouseEnter={(e) => {
            if (isLogging) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.background =
                "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)";
            }
          }}
          onMouseLeave={(e) => {
            if (isLogging) {
              e.target.style.transform = "translateY(0)";
              e.target.style.background =
                "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)";
            }
          }}
        >
          ⏹️ Stop NetLog
        </button>
      </div>

      {netLogStatus && (
        <div style={successBoxStyle}>
          <strong>Status:</strong> {netLogStatus}
        </div>
      )}
    </section>
  );
};

export default NetLogSection;
