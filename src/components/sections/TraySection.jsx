import { useState } from "react";
import {
  sectionStyle,
  headerStyle,
  apiLabelStyle,
  descriptionStyle,
  buttonContainerStyle,
  buttonStyle,
  secondaryButtonStyle,
  successBoxStyle,
  errorBoxStyle,
  badgeStyle,
} from "./sharedStyles";

const TraySection = () => {
  const [trayCreated, setTrayCreated] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);

  const createTrayIcon = async () => {
    const result = await window.electronAPI?.createTray();
    if (result?.success) {
      setTrayCreated(true);
      // Set context menu for tray
      await window.electronAPI?.setTrayContextMenu([
        { label: "Show App", click: () => console.log("Show clicked") },
        { type: "separator" },
        { label: "Quit", role: "quit" },
      ]);
      setNotificationStatus("Tray icon created!");
      setIsSuccess(true);
    } else {
      setNotificationStatus(`Error: ${result?.error || "Failed"}`);
      setIsSuccess(false);
    }
    setTimeout(() => setNotificationStatus(""), 3000);
  };

  const removeTrayIcon = async () => {
    const ok = await window.electronAPI?.destroyTray();
    if (ok) {
      setTrayCreated(false);
      setNotificationStatus("Tray icon removed!");
      setIsSuccess(true);
    } else {
      setNotificationStatus("Error removing tray");
      setIsSuccess(false);
    }
    setTimeout(() => setNotificationStatus(""), 3000);
  };

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>
        📍 Tray
        {trayCreated && <span style={badgeStyle}>ACTIVE</span>}
      </h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> Tray, Tray.setContextMenu(), setToolTip(),
        setImage(), destroy()
      </div>

      <p style={descriptionStyle}>
        Implements persistent system tray presence for quick access and status
        visibility. Tray icon appears in system notification area with
        customizable context menus, tooltips, and dynamic icons. Perfect for
        background-running apps like chat clients or monitoring tools.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={createTrayIcon}
          disabled={trayCreated}
          style={{
            ...buttonStyle,
            opacity: trayCreated ? 0.5 : 1,
            cursor: trayCreated ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!trayCreated) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!trayCreated) {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
            }
          }}
        >
          ➕ Create Tray Icon
        </button>
        <button
          onClick={removeTrayIcon}
          disabled={!trayCreated}
          style={{
            ...secondaryButtonStyle,
            opacity: !trayCreated ? 0.5 : 1,
            cursor: !trayCreated ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (trayCreated) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.background =
                "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)";
            }
          }}
          onMouseLeave={(e) => {
            if (trayCreated) {
              e.target.style.transform = "translateY(0)";
              e.target.style.background =
                "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)";
            }
          }}
        >
          ➖ Remove Tray Icon
        </button>
      </div>

      {notificationStatus && (
        <div style={isSuccess ? successBoxStyle : errorBoxStyle}>
          <strong>{isSuccess ? "✓ Success: " : "✗ Error: "}</strong>
          {notificationStatus}
        </div>
      )}
    </section>
  );
};

export default TraySection;
