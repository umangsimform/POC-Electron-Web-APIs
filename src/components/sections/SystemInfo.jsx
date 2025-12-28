import { useEffect, useState } from "react";
import {
  sectionStyle,
  headerStyle,
  apiLabelStyle,
  descriptionStyle,
  infoBoxStyle,
  badgeStyle,
} from "./sharedStyles";

const SystemInfo = () => {
  const [appInfo, setAppInfo] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [isDark, setIsDark] = useState(null);
  const [accentColor, setAccentColor] = useState(null);

  useEffect(() => {
    if (window?.electronAPI?.getAppInfo) {
      window.electronAPI.getAppInfo().then((info) => setAppInfo(info));
    }

    if (window?.osApi?.platform) {
      setPlatform(window.osApi.platform());
    }
  }, []);

  const checkSystemPrefs = async () => {
    const dark = await window.electronAPI?.isDarkMode();
    const accent = await window.electronAPI?.getAccentColor();
    setIsDark(dark ?? null);
    setAccentColor(accent ?? null);
  };

  useEffect(() => {
    checkSystemPrefs();
  }, []);

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>🖥️ System Info</h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> app.getName(), app.getVersion(),
        process.platform, nativeTheme.shouldUseDarkColors,
        systemPreferences.getAccentColor()
      </div>

      <p style={descriptionStyle}>
        Provides comprehensive system and application information including app
        name, version, OS platform detection, theme preferences (dark/light
        mode), and system accent colors. Essential for debugging, user support,
        and creating platform-adaptive interfaces.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "12px",
        }}
      >
        <div style={infoBoxStyle}>
          <div
            style={{ fontSize: "11px", color: "#a0aec0", marginBottom: "4px" }}
          >
            Platform
          </div>
          <div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>
            {platform || "loading..."}
            {platform && (
              <span style={badgeStyle}>{platform.toUpperCase()}</span>
            )}
          </div>
        </div>

        <div style={infoBoxStyle}>
          <div
            style={{ fontSize: "11px", color: "#a0aec0", marginBottom: "4px" }}
          >
            Application
          </div>
          <div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>
            {appInfo ? `${appInfo.name} v${appInfo.version}` : "loading..."}
          </div>
        </div>

        <div style={infoBoxStyle}>
          <div
            style={{ fontSize: "11px", color: "#a0aec0", marginBottom: "4px" }}
          >
            Dark Mode
          </div>
          <div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>
            {isDark === null ? "unknown" : isDark ? "Yes 🌙" : "No ☀️"}
          </div>
        </div>

        <div style={infoBoxStyle}>
          <div
            style={{ fontSize: "11px", color: "#a0aec0", marginBottom: "4px" }}
          >
            Accent Color
          </div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {accentColor ?? "n/a"}
            {accentColor && (
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "4px",
                  background: accentColor,
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemInfo;
