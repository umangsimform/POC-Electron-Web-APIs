import { useState, useEffect } from "react";
import {
  sectionStyle,
  headerStyle,
  apiLabelStyle,
  descriptionStyle,
  buttonContainerStyle,
  buttonStyle,
  infoBoxStyle,
} from "./sharedStyles";

const SystemPreferences = () => {
  const [isDark, setIsDark] = useState(null);
  const [accentColor, setAccentColor] = useState(null);

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
      <h3 style={headerStyle}>⚙️ System Preferences</h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> systemPreferences.isDarkMode(), getAccentColor(),
        getColor(), getSystemColor(), nativeTheme.shouldUseDarkColors,
        nativeTheme.on('updated')
      </div>

      <p style={descriptionStyle}>
        Deep integration with OS appearance settings and user preferences.
        Automatically detect and adapt to dark/light mode, use system accent
        colors, and listen for real-time theme changes. Essential for
        accessibility, visual consistency, and professional desktop environments
        that respect user customization.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={checkSystemPrefs}
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
          🔄 Refresh System Prefs
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginTop: "16px",
        }}
      >
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

export default SystemPreferences;
