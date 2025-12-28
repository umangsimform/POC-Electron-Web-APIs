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
  badgeStyle,
} from "./sharedStyles";

const PowerSaveBlocker = () => {
  const [psbId, setPsbId] = useState(null);

  const startPsb = async () => {
    const id = await window.electronAPI?.startPowerSaveBlocker();
    setPsbId(id ?? null);
  };

  const stopPsb = async () => {
    if (!psbId) return;
    const ok = await window.electronAPI?.stopPowerSaveBlocker(psbId);
    if (ok) setPsbId(null);
  };

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>
        ⚡ Power Save Blocker
        {psbId && <span style={badgeStyle}>ACTIVE</span>}
      </h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> powerSaveBlocker.start(),
        powerSaveBlocker.stop(), powerSaveBlocker.isStarted()
      </div>

      <p style={descriptionStyle}>
        Prevents system sleep or screensaver during critical operations.
        Essential for unattended tasks like downloads, video playback,
        presentations, data processing, or monitoring. Two modes available:
        prevent-app-suspension (allows screen dimming) and prevent-display-sleep
        (keeps everything active). Managed lifecycle ensures minimal battery
        impact.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={startPsb}
          disabled={!!psbId}
          style={{
            ...buttonStyle,
            opacity: psbId ? 0.5 : 1,
            cursor: psbId ? "not-allowed" : "pointer",
            background: psbId
              ? "linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
              : buttonStyle.background,
          }}
          onMouseEnter={(e) => {
            if (!psbId) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!psbId) {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
            }
          }}
        >
          ▶️ Start Blocker
        </button>
        <button
          onClick={stopPsb}
          disabled={!psbId}
          style={{
            ...secondaryButtonStyle,
            opacity: psbId ? 1 : 0.5,
            cursor: psbId ? "pointer" : "not-allowed",
          }}
          onMouseEnter={(e) => {
            if (psbId) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.background =
                "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)";
            }
          }}
          onMouseLeave={(e) => {
            if (psbId) {
              e.target.style.transform = "translateY(0)";
              e.target.style.background =
                "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)";
            }
          }}
        >
          ⏹️ Stop Blocker
        </button>
      </div>

      <div style={infoBoxStyle}>
        <div
          style={{ fontSize: "11px", color: "#a0aec0", marginBottom: "4px" }}
        >
          Blocker Status
        </div>
        <div
          style={{
            fontSize: "15px",
            fontWeight: "600",
            color: psbId ? "#48bb78" : "#a0aec0",
          }}
        >
          {psbId ? `Active (ID: ${psbId})` : "Not active"}
        </div>
      </div>
    </section>
  );
};

export default PowerSaveBlocker;
