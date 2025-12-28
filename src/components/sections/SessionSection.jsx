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

const SessionSection = () => {
  const [cacheSize, setCacheSize] = useState(null);
  const [cookies, setCookies] = useState([]);
  const [sessionStatus, setSessionStatus] = useState("");

  const clearCache = async () => {
    const result = await window.electronAPI?.sessionClearCache();
    if (result?.success) {
      setSessionStatus("Cache cleared!");
      setCacheSize(null);
    } else {
      setSessionStatus(`Error: ${result?.error || "Failed"}`);
    }
    setTimeout(() => setSessionStatus(""), 3000);
  };

  const getCacheSize = async () => {
    const result = await window.electronAPI?.sessionGetCacheSize();
    if (result?.success) {
      setCacheSize(result.size);
      setSessionStatus(
        `Cache size: ${(result.size / 1024 / 1024).toFixed(2)} MB`
      );
    } else {
      setSessionStatus(`Error: ${result?.error || "Failed"}`);
    }
    setTimeout(() => setSessionStatus(""), 3000);
  };

  const getAllCookies = async () => {
    const result = await window.electronAPI?.sessionGetCookies();
    if (result?.success) {
      setCookies(result.cookies || []);
      setSessionStatus(`Found ${result.cookies?.length || 0} cookies`);
    } else {
      setSessionStatus(`Error: ${result?.error || "Failed"}`);
    }
    setTimeout(() => setSessionStatus(""), 3000);
  };

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>💾 Session</h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> session.clearCache(), getCacheSize(),
        cookies.get(), cookies.set(), cookies.remove()
      </div>

      <p style={descriptionStyle}>
        Granular control over browser session data including cache management
        and cookie manipulation. Monitor cache size, clear cached data, and
        manage cookies for authentication states, data persistence, logout
        functionality, and privacy features. Essential for user data management
        and security.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={getCacheSize}
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
          📊 Get Cache Size
        </button>
        <button
          onClick={clearCache}
          style={secondaryButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.background =
              "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.background =
              "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)";
          }}
        >
          🗑️ Clear Cache
        </button>
        <button
          onClick={getAllCookies}
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
          🍪 Get All Cookies
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginTop: "16px",
        }}
      >
        {cacheSize !== null && (
          <div style={infoBoxStyle}>
            <div
              style={{
                fontSize: "11px",
                color: "#a0aec0",
                marginBottom: "4px",
              }}
            >
              Cache Size
            </div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>
              {(cacheSize / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        )}
        {cookies.length > 0 && (
          <div style={infoBoxStyle}>
            <div
              style={{
                fontSize: "11px",
                color: "#a0aec0",
                marginBottom: "4px",
              }}
            >
              Cookies Found
            </div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>
              {cookies.length}
            </div>
          </div>
        )}
      </div>

      {sessionStatus && (
        <div style={successBoxStyle}>
          <strong>Status:</strong> {sessionStatus}
        </div>
      )}
    </section>
  );
};

export default SessionSection;
