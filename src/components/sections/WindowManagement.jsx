import { useState } from "react";
import {
  sectionStyle,
  headerStyle,
  apiLabelStyle,
  descriptionStyle,
  buttonContainerStyle,
  buttonStyle,
  secondaryButtonStyle,
  codeBlockStyle,
  badgeStyle,
} from "./sharedStyles";

const WindowManagement = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);
  const [windowBounds, setWindowBounds] = useState(null);
  const [isResizable, setIsResizable] = useState(true);

  const toggleFullScreen = async () => {
    const current = await window.electronAPI?.isFullScreen();
    await window.electronAPI?.setFullScreen(!current);
    setIsFullScreen(!current);
  };

  const toggleAlwaysOnTop = async () => {
    const current = await window.electronAPI?.isAlwaysOnTop();
    await window.electronAPI?.setAlwaysOnTop(!current);
    setIsAlwaysOnTop(!current);
  };

  const getWindowBounds = async () => {
    const bounds = await window.electronAPI?.getWindowBounds();
    setWindowBounds(bounds);
  };

  const centerWindow = async () => {
    await window.electronAPI?.centerWindow();
    await getWindowBounds();
  };

  const toggleResizable = async () => {
    const current = await window.electronAPI?.isResizable();
    await window.electronAPI?.setResizable(!current);
    setIsResizable(!current);
  };

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>
        🎯 Window Management
        {isFullScreen && <span style={badgeStyle}>FULLSCREEN</span>}
        {isAlwaysOnTop && <span style={badgeStyle}>ON TOP</span>}
      </h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> BrowserWindow.setFullScreen(), isFullScreen(),
        setAlwaysOnTop(), isAlwaysOnTop(), getBounds(), setBounds(), center(),
        setResizable(), isResizable()
      </div>

      <p style={descriptionStyle}>
        Comprehensive window behavior control including fullscreen mode for
        immersive experiences, always-on-top for reference windows, precise
        bounds management for positioning and sizing, window centering, and
        resizable toggles. Essential for creating flexible user experiences
        across different use cases.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={toggleFullScreen}
          style={
            isFullScreen
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
          {isFullScreen ? "⛶ Exit Fullscreen" : "⛶ Fullscreen"}
        </button>
        <button
          onClick={toggleAlwaysOnTop}
          style={
            isAlwaysOnTop
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
          {isAlwaysOnTop ? "📌 Disable Always On Top" : "📌 Always On Top"}
        </button>
        <button
          onClick={getWindowBounds}
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
          📐 Get Bounds
        </button>
        <button
          onClick={centerWindow}
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
          🎯 Center Window
        </button>
        <button
          onClick={toggleResizable}
          style={
            isResizable
              ? buttonStyle
              : {
                  ...buttonStyle,
                  background:
                    "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)",
                }
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
          {isResizable ? "🔒 Disable Resize" : "🔓 Enable Resize"}
        </button>
      </div>

      {windowBounds && (
        <div>
          <h4
            style={{
              color: "#a0aec0",
              fontSize: "13px",
              marginBottom: "8px",
              marginTop: "16px",
            }}
          >
            Window Bounds:
          </h4>
          <pre style={codeBlockStyle}>
            {JSON.stringify(windowBounds, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
};

export default WindowManagement;
