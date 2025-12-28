import { useState } from "react";
import {
  sectionStyle,
  headerStyle,
  apiLabelStyle,
  descriptionStyle,
  buttonContainerStyle,
  buttonStyle,
  successBoxStyle,
} from "./sharedStyles";

const PrintSection = () => {
  const [printStatus, setPrintStatus] = useState("");

  const printPage = async () => {
    setPrintStatus("Opening print dialog...");
    const result = await window.electronAPI?.webContentsPrint({
      silent: false,
      printBackground: true,
    });
    if (result?.success) {
      setPrintStatus("Print completed!");
    } else {
      setPrintStatus(`Error: ${result?.error || "Cancelled"}`);
    }
    setTimeout(() => setPrintStatus(""), 3000);
  };

  const printToPDF = async () => {
    setPrintStatus("Generating PDF...");
    const result = await window.electronAPI?.webContentsPrintToPDF({
      marginsType: 0,
      printBackground: true,
    });
    if (result?.success) {
      setPrintStatus(`PDF generated! (${result.data?.length} bytes)`);
    } else {
      setPrintStatus(`Error: ${result?.error || "Failed"}`);
    }
    setTimeout(() => setPrintStatus(""), 3000);
  };

  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>🖨️ Print</h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> webContents.print(), webContents.printToPDF(),
        PrintOptions, PDFOptions
      </div>

      <p style={descriptionStyle}>
        Powerful printing capabilities for physical prints and PDF generation.
        Opens native print dialogs with full printer configuration, or generates
        high-quality PDFs programmatically with customizable page settings.
        Essential for business applications, reporting tools, and document
        management systems.
      </p>

      <div style={buttonContainerStyle}>
        <button
          onClick={printPage}
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
          🖨️ Print Page
        </button>
        <button
          onClick={printToPDF}
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
          📄 Print to PDF
        </button>
      </div>

      {printStatus && (
        <div style={successBoxStyle}>
          <strong>Status:</strong> {printStatus}
        </div>
      )}
    </section>
  );
};

export default PrintSection;
