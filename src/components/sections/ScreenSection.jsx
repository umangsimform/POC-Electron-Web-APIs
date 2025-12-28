import { useState } from "react";
import {
  sectionStyle,
  headerStyle,
  apiLabelStyle,
  descriptionStyle,
  buttonContainerStyle,
  buttonStyle,
  codeBlockStyle,
  infoBoxStyle,
} from "./sharedStyles";

const ScreenSection = () => {
  const [displays, setDisplays] = useState([]);
  const [cursorPoint, setCursorPoint] = useState(null);

  const showScreenInfo = async () => {
    const primary = await window.electronAPI?.getPrimaryDisplay();
    const all = await window.electronAPI?.getAllDisplays();
    const cursor = await window.electronAPI?.getCursorPoint();
    setDisplays(all || []);
    setCursorPoint(cursor || null);
    console.log({ primary, all, cursor });
  };

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>🖥️ Screen</h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> screen.getPrimaryDisplay(),
        screen.getAllDisplays(), screen.getDisplayNearestPoint(),
        screen.getCursorScreenPoint(), Display object
      </div>

      <p style={descriptionStyle}>
        Comprehensive display configuration information for multi-monitor
        awareness. Detect all connected displays with detailed specifications
        (resolution, scaling, size), track cursor position across monitors, and
        intelligently position windows. Crucial for professional multi-monitor
        setups and responsive UIs.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={showScreenInfo}
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
          🖥️ Get Screen Info
        </button>
      </div>

      {displays.length > 0 && (
        <div style={infoBoxStyle}>
          <div
            style={{ fontSize: "11px", color: "#a0aec0", marginBottom: "8px" }}
          >
            Displays Detected: {displays.length}
          </div>
          {cursorPoint && (
            <div
              style={{ fontSize: "12px", color: "#fff", marginBottom: "12px" }}
            >
              <strong>Cursor:</strong> x:{cursorPoint.x}, y:{cursorPoint.y}
            </div>
          )}
        </div>
      )}

      {displays.length > 0 && (
        <div>
          <h4
            style={{
              color: "#a0aec0",
              fontSize: "13px",
              marginBottom: "8px",
              marginTop: "16px",
            }}
          >
            Display Information:
          </h4>
          <pre
            style={{
              ...codeBlockStyle,
              maxHeight: "200px",
              overflow: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#667eea rgba(26, 32, 44, 0.4)",
            }}
            className="scrollable-container"
          >
            {JSON.stringify(
              {
                displaysCount: displays.length,
                cursorPosition: cursorPoint || null,
                displays: displays,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </section>
  );
};

export default ScreenSection;
