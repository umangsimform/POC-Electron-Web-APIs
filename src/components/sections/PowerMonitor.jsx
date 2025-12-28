import { useState } from "react";
import {
  sectionStyle,
  headerStyle,
  apiLabelStyle,
  descriptionStyle,
  buttonContainerStyle,
  buttonStyle,
  infoBoxStyle,
  badgeStyle,
} from "./sharedStyles";

const PowerMonitor = () => {
  const [pmEvents, setPmEvents] = useState([]);

  const subscribePM = (evName) => {
    if (!window.electronAPI?.subscribePowerMonitor) return;
    const unsub = window.electronAPI.subscribePowerMonitor(evName, (data) => {
      setPmEvents((s) => [data, ...s].slice(0, 20));
    });
    return unsub;
  };

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>
        🔋 Power Monitor Events
        {pmEvents.length > 0 && (
          <span style={badgeStyle}>{pmEvents.length} events</span>
        )}
      </h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> powerMonitor.on('suspend'), on('resume'),
        on('on-ac'), on('on-battery'), on('lock-screen'), on('unlock-screen')
      </div>

      <p style={descriptionStyle}>
        Intelligent response to system power state changes and user activity.
        Monitors suspend/resume events, battery status changes, and screen lock
        states. Enables energy-efficient applications that adjust performance,
        pause operations, or implement security measures based on power context
        and user presence.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={() => subscribePM("suspend")}
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
          💤 Subscribe: suspend
        </button>
        <button
          onClick={() => subscribePM("resume")}
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
          ⚡ Subscribe: resume
        </button>
        <button
          onClick={() => subscribePM("on-ac")}
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
          🔌 Subscribe: on-ac
        </button>
        <button
          onClick={() => subscribePM("on-battery")}
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
          🔋 Subscribe: on-battery
        </button>
      </div>

      <div style={infoBoxStyle}>
        <div
          style={{ fontSize: "11px", color: "#a0aec0", marginBottom: "8px" }}
        >
          <strong>Recent Events ({pmEvents.length}/20)</strong>
        </div>
        {pmEvents.length === 0 ? (
          <div
            style={{ fontSize: "12px", color: "#718096", fontStyle: "italic" }}
          >
            No events yet. Subscribe and trigger system events.
          </div>
        ) : (
          <ul
            style={{
              maxHeight: "150px",
              overflow: "auto",
              margin: 0,
              paddingLeft: "20px",
              fontSize: "12px",
              color: "#fff",
              scrollbarWidth: "thin",
              scrollbarColor: "#667eea rgba(26, 32, 44, 0.4)",
            }}
            className="scrollable-container"
          >
            {pmEvents.map((e, i) => (
              <li
                key={`${e.event}-${e.ts}-${i}`}
                style={{ marginBottom: "4px" }}
              >
                <strong>{e.event}</strong> @{" "}
                {new Date(e.ts).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default PowerMonitor;
