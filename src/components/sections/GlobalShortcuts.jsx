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

const GlobalShortcuts = () => {
  const [shortcutStatus, setShortcutStatus] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const registerShortcut = async () => {
    const result = await window.electronAPI?.registerGlobalShortcut(
      "CommandOrControl+Shift+K",
      () => {
        setShortcutStatus("Shortcut triggered!");
        setTimeout(() => setShortcutStatus(""), 3000);
      }
    );
    if (result?.success) {
      setShortcutStatus("Registered: Ctrl+Shift+K");
      setIsRegistered(true);
    } else {
      setShortcutStatus(`Error: ${result?.error || "Failed"}`);
      setIsRegistered(false);
    }
  };

  const unregisterShortcut = async () => {
    const ok = await window.electronAPI?.unregisterGlobalShortcut(
      "CommandOrControl+Shift+K"
    );
    setShortcutStatus(ok ? "Unregistered" : "Error unregistering");
    setIsRegistered(false);
    setTimeout(() => setShortcutStatus(""), 3000);
  };

  const showContextMenu = async () => {
    await window.electronAPI?.popupMenu([
      { label: "Item 1", click: () => console.log("Item 1 clicked") },
      { label: "Item 2", click: () => console.log("Item 2 clicked") },
      { type: "separator" },
      { label: "Quit", role: "quit" },
    ]);
  };

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>
        ⌨️ Global Shortcuts
        {isRegistered && <span style={badgeStyle}>ACTIVE</span>}
      </h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> globalShortcut.register(), unregister(),
        isRegistered(), Menu.buildFromTemplate(), Menu.popup()
      </div>

      <p style={descriptionStyle}>
        Enables keyboard-driven interactions and contextual menus. Global
        shortcuts respond to keyboard combinations even when app is not focused,
        while context menus provide right-click popup menus with customizable
        items and native OS styling for intuitive navigation.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={registerShortcut}
          style={
            isRegistered
              ? {
                  ...buttonStyle,
                  background:
                    "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                }
              : buttonStyle
          }
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
          }}
        >
          ✅ Register Ctrl+Shift+K
        </button>
        <button
          onClick={unregisterShortcut}
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
          ❌ Unregister
        </button>
        <button
          onClick={showContextMenu}
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
          📱 Show Context Menu
        </button>
      </div>

      {shortcutStatus && (
        <div style={infoBoxStyle}>
          <strong>Status:</strong> {shortcutStatus}
        </div>
      )}
    </section>
  );
};

export default GlobalShortcuts;
