import { useState } from "react";
import {
  sectionStyle,
  headerStyle,
  apiLabelStyle,
  descriptionStyle,
  buttonContainerStyle,
  buttonStyle,
  infoBoxStyle,
} from "./sharedStyles";

const ClipboardSection = ({ platform }) => {
  const [clipboardText, setClipboardText] = useState("");

  const readClipboard = async () => {
    const txt = await window.electronAPI?.readClipboardText();
    setClipboardText(txt ?? "");
  };

  const writeClipboard = async () => {
    await window.electronAPI?.writeClipboardText(
      `Hello from ${platform || "app"} @ ${new Date().toLocaleTimeString()}`
    );
    await readClipboard();
  };

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>📋 Clipboard</h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> clipboard.readText(), clipboard.writeText(),
        clipboard.readImage(), clipboard.writeImage(), clipboard.clear()
      </div>

      <p style={descriptionStyle}>
        Seamless system clipboard interaction for data exchange between
        applications. Read text or images copied from other programs, write
        content for users to paste elsewhere, or clear clipboard for security.
        Fundamental for workflow integration and cross-application data sharing.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={readClipboard}
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
          📖 Read Clipboard
        </button>
        <button
          onClick={writeClipboard}
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
          ✍️ Write Clipboard
        </button>
      </div>

      <div style={infoBoxStyle}>
        <div
          style={{ fontSize: "11px", color: "#a0aec0", marginBottom: "4px" }}
        >
          Clipboard Content
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "#fff",
            fontFamily: "monospace",
            wordBreak: "break-all",
          }}
        >
          {clipboardText || "(empty)"}
        </div>
      </div>
    </section>
  );
};

export default ClipboardSection;
