import { useState } from "react";
import {
  sectionStyle,
  headerStyle,
  apiLabelStyle,
  descriptionStyle,
  buttonContainerStyle,
  buttonStyle,
  successBoxStyle,
  errorBoxStyle,
} from "./sharedStyles";

const NotificationSection = () => {
  const [notificationStatus, setNotificationStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);

  const sendNotification = async () => {
    const result = await window.electronAPI?.showNotification({
      title: "Electron Notification",
      body: "This is a test notification from Electron!",
      urgency: "normal",
    });
    if (result?.success) {
      setNotificationStatus("Notification sent!");
      setIsSuccess(true);
    } else {
      setNotificationStatus(`Error: ${result?.error || "Failed"}`);
      setIsSuccess(false);
    }
    setTimeout(() => setNotificationStatus(""), 3000);
  };

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>🔔 Notification</h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> Notification, Notification.isSupported(),
        Notification.show()
      </div>

      <p style={descriptionStyle}>
        Delivers timely, non-intrusive messages through the OS notification
        system. Creates system-level notifications that appear even when the app
        is minimized, with customizable title, body, urgency levels, and click
        interaction support. Essential for keeping users informed without
        disrupting workflow.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={sendNotification}
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
          📬 Send Notification
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

export default NotificationSection;
