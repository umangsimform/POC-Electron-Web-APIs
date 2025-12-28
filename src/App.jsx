import "./App.scss";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

// Import all section components
import {
  // Window & App Control
  SystemInfo,
  WindowControls,
  DialogShell,
  // Window Management
  WindowManagement,
  GlobalShortcuts,
  // Notifications
  NotificationSection,
  TraySection,
  DockSection,
  // Files & Printing
  NetLogSection,
  SessionSection,
  PrintSection,
  InAppPurchase,
  // OS Utilities
  ClipboardSection,
  ScreenSection,
  PowerSaveBlocker,
  PowerMonitor,
  SystemPreferences,
} from "./components/sections";

function App() {
  const state = useSelector((state) => state);
  const [activeCategory, setActiveCategory] = useState("Window & App Control");
  const [platform, setPlatform] = useState(null);

  const categories = [
    {
      name: "Window & App Control",
      sections: [
        "System Info",
        "Window Controls",
        "Dialog & Shell",
        "BrowserView",
        "Native Image",
      ],
    },
    {
      name: "Window Management",
      sections: ["Window Management", "Global Shortcuts", "Menu"],
    },
    {
      name: "Notifications",
      sections: ["Notification", "Tray", "Dock (macOS)"],
    },
    {
      name: "Files & Printing",
      sections: ["Net & NetLog", "Session", "Print", "In-App Purchase (macOS)"],
    },
    {
      name: "OS Utilities",
      sections: [
        "Clipboard",
        "Screen",
        "Power Save Blocker",
        "Power Monitor",
        "System Preferences",
      ],
    },
  ];

  useEffect(() => {
    console.info("============== Redux Store ==============", state);

    if (window?.osApi?.platform) {
      setPlatform(window.osApi.platform());
    }
  }, []);

  return (
    <div
      className="app-root"
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #1a202c 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      }}
    >
      <Toaster />

      {/* Sidebar */}
      <aside
        style={{
          width: "280px",
          background:
            "linear-gradient(180deg, rgba(45, 55, 72, 0.8) 0%, rgba(26, 32, 44, 0.9) 100%)",
          color: "white",
          padding: "30px 20px",
          overflowY: "auto",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.3)",
          scrollbarWidth: "thin",
          scrollbarColor: "#667eea rgba(26, 32, 44, 0.4)",
        }}
        className="scrollable-container"
      >
        <h2
          style={{
            marginTop: 0,
            fontSize: "24px",
            marginBottom: "30px",
            fontWeight: "700",
            background: "linear-gradient(135deg, #667eea 0%, #f093fb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.5px",
          }}
        >
          ⚡ Electron APIs
        </h2>

        {categories.map((category) => (
          <div key={category.name} style={{ marginBottom: "8px" }}>
            <button
              onClick={() => setActiveCategory(category.name)}
              style={{
                width: "100%",
                padding: "14px 16px",
                background:
                  activeCategory === category.name
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "rgba(255, 255, 255, 0.03)",
                color: "white",
                border:
                  activeCategory === category.name
                    ? "1px solid rgba(102, 126, 234, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "left",
                fontWeight: activeCategory === category.name ? "600" : "500",
                fontSize: "14px",
                transition: "all 0.3s ease",
                boxShadow:
                  activeCategory === category.name
                    ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                    : "0 2px 8px rgba(0, 0, 0, 0.1)",
                transform:
                  activeCategory === category.name
                    ? "translateX(4px)"
                    : "translateX(0)",
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== category.name) {
                  e.target.style.background = "rgba(255, 255, 255, 0.08)";
                  e.target.style.transform = "translateX(4px)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== category.name) {
                  e.target.style.background = "rgba(255, 255, 255, 0.03)";
                  e.target.style.transform = "translateX(0)";
                }
              }}
            >
              {category.name}
            </button>
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "40px",
          overflowY: "auto",
          background:
            "linear-gradient(180deg, rgba(26, 32, 44, 0.5) 0%, rgba(45, 55, 72, 0.3) 100%)",
          scrollbarWidth: "thin",
          scrollbarColor: "#667eea rgba(26, 32, 44, 0.4)",
        }}
        className="scrollable-container"
      >
        <div
          style={{
            marginBottom: "30px",
            padding: "24px",
            background:
              "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "10px",
              fontSize: "32px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #667eea 0%, #f093fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-1px",
            }}
          >
            {activeCategory}
          </h2>
          <p
            style={{
              color: "#a0aec0",
              fontSize: "15px",
              lineHeight: "1.6",
              marginTop: "8px",
              marginBottom: "0",
            }}
          >
            Explore powerful {activeCategory.toLowerCase()} features provided by
            Electron
          </p>
        </div>

        {/* Window & App Control Category */}
        {activeCategory === "Window & App Control" && (
          <>
            <SystemInfo />
            <WindowControls />
            <DialogShell />
          </>
        )}

        {/* Window Management Category */}
        {activeCategory === "Window Management" && (
          <>
            <WindowManagement />
            <GlobalShortcuts />
          </>
        )}

        {/* Notifications Category */}
        {activeCategory === "Notifications" && (
          <>
            <NotificationSection />
            <TraySection />
            <DockSection />
          </>
        )}

        {/* Files & Printing Category */}
        {activeCategory === "Files & Printing" && (
          <>
            <NetLogSection />
            <SessionSection />
            <PrintSection />
            <InAppPurchase />
          </>
        )}

        {/* OS Utilities Category */}
        {activeCategory === "OS Utilities" && (
          <>
            <ClipboardSection platform={platform} />
            <ScreenSection />
            <PowerSaveBlocker />
            <PowerMonitor />
            <SystemPreferences />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
