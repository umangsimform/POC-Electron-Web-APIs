import {
  sectionStyle,
  headerStyle,
  apiLabelStyle,
  descriptionStyle,
  buttonContainerStyle,
  buttonStyle,
} from "./sharedStyles";

const DialogShell = () => {
  const onOpenExternal = () =>
    window.electronAPI?.openExternal("https://www.electronjs.org");

  const onOpenFile = async () => {
    const res = await window.electronAPI?.showOpenDialog({
      properties: ["openFile"],
    });
    console.log("open dialog result", res);
  };

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>📂 Dialog & Shell</h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> dialog.showOpenDialog(), shell.openExternal()
      </div>

      <p style={descriptionStyle}>
        Bridges the application with system resources through native dialogs and
        external launchers. ShowOpenDialog presents familiar file picker dialogs
        for browsing and selecting files, while shell.openExternal safely opens
        URLs in default browsers or launches files with associated applications.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={onOpenFile}
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
          📁 Open File Dialog...
        </button>
        <button
          onClick={onOpenExternal}
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
          🌐 Open electronjs.org
        </button>
      </div>
    </section>
  );
};

export default DialogShell;
