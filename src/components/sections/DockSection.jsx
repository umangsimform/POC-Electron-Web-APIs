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
  badgeStyle,
} from "./sharedStyles";

const DockSection = () => {
  const [dockBadge, setDockBadge] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("");

  const bounceDock = async (type) => {
    const result = await window.electronAPI?.dockBounce(type);
    if (result?.success) {
      setNotificationStatus(`Dock bouncing (ID: ${result.id})`);
    } else {
      setNotificationStatus(`Error: ${result?.error || "Not on macOS"}`);
    }
    setTimeout(() => setNotificationStatus(""), 3000);
  };

  const updateDockBadge = async () => {
    const newBadge = dockBadge === "" ? "5" : "";
    const ok = await window.electronAPI?.dockSetBadge(newBadge);
    if (ok) {
      setDockBadge(newBadge);
    }
  };

  const setDockMenu = async () => {
    const ok = await window.electronAPI?.dockSetMenu([
      { label: "New Window", click: () => console.log("New Window") },
      { label: "Settings", click: () => console.log("Settings") },
    ]);
    if (ok) {
      setNotificationStatus("Dock menu set!");
    } else {
      setNotificationStatus("Error: Not on macOS");
    }
    setTimeout(() => setNotificationStatus(""), 3000);
  };

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>
        🎪 Dock (macOS)
        {dockBadge && <span style={badgeStyle}>{dockBadge}</span>}
      </h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> app.dock.bounce(), cancelBounce(), setBadge(),
        getBadge(), setMenu(), show(), hide()
      </div>

      <p style={descriptionStyle}>
        Deep macOS Dock integration with bounce animations for user attention
        (critical/informational modes), badge overlays for notification counts,
        and custom Dock menus. Creates native macOS experiences that users
        expect from quality desktop applications.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={() => bounceDock("critical")}
          style={{
            ...buttonStyle,
            background: "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(245, 101, 101, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 8px rgba(245, 101, 101, 0.3)";
          }}
        >
          🔴 Bounce (Critical)
        </button>
        <button
          onClick={() => bounceDock("informational")}
          style={{
            ...buttonStyle,
            background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(66, 153, 225, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 8px rgba(66, 153, 225, 0.3)";
          }}
        >
          ℹ️ Bounce (Info)
        </button>
        <button
          onClick={updateDockBadge}
          style={dockBadge ? secondaryButtonStyle : buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            if (dockBadge) {
              e.target.style.background =
                "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)";
            } else {
              e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            if (dockBadge) {
              e.target.style.background =
                "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)";
            } else {
              e.target.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
            }
          }}
        >
          {dockBadge ? "🔄 Clear Badge" : "🔔 Set Badge (5)"}
        </button>
        <button
          onClick={setDockMenu}
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
          📝 Set Dock Menu
        </button>
      </div>

      <div style={infoBoxStyle}>
        <div
          style={{ fontSize: "11px", color: "#a0aec0", marginBottom: "4px" }}
        >
          Dock Badge
        </div>
        <div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>
          {dockBadge || "(none)"}
        </div>
      </div>

      {notificationStatus && (
        <div style={successBoxStyle}>
          <strong>Status:</strong> {notificationStatus}
        </div>
      )}
    </section>
  );
};

export default DockSection;
