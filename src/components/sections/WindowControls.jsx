import {
  sectionStyle,
  headerStyle,
  apiLabelStyle,
  descriptionStyle,
  buttonContainerStyle,
  buttonStyle,
} from "./sharedStyles";

const WindowControls = () => {
  const onMinimize = () => window.electronAPI?.minimize();
  const onToggleMax = () => window.electronAPI?.toggleMaximize();

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>🪟 Window Controls</h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> BrowserWindow.minimize(),
        BrowserWindow.maximize(), BrowserWindow.unmaximize(),
        BrowserWindow.isMaximized()
      </div>

      <p style={descriptionStyle}>
        Implements essential window management controls for desktop
        applications. Provides minimize functionality to hide the window to
        taskbar/dock, and maximize/restore toggle to expand the window to full
        screen or return to previous size, matching native OS window behavior.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={onMinimize}
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
          ➖ Minimize
        </button>
        <button
          onClick={onToggleMax}
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
          ⛶ Toggle Maximize
        </button>
      </div>
    </section>
  );
};

export default WindowControls;
