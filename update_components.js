#!/usr/bin/env node
/**
 * Script to update all remaining Electron component files with modern styling
 */

const fs = require('node:fs');
const path = require('node:path');

// Define the components to update with their icons and specific styles
const COMPONENTS = {
  'GlobalShortcuts.jsx': {
    icon: '⌨️',
    title: 'Global Shortcuts',
  },
  'TraySection.jsx': {
    icon: '📍',
    title: 'Tray',
  },
  'DockSection.jsx': {
    icon: '🎪',
    title: 'Dock (macOS)',
  },
  'NetLogSection.jsx': {
    icon: '🌐',
    title: 'Net & NetLog',
  },
  'SessionSection.jsx': {
    icon: '💾',
    title: 'Session',
  },
  'PrintSection.jsx': {
    icon: '🖨️',
    title: 'Print',
  },
  'InAppPurchase.jsx': {
    icon: '💳',
    title: 'In-App Purchase (macOS)',
  },
  'ClipboardSection.jsx': {
    icon: '📋',
    title: 'Clipboard',
  },
  'ScreenSection.jsx': {
    icon: '🖥️',
    title: 'Screen',
  },
  'PowerSaveBlocker.jsx': {
    icon: '⚡',
    title: 'Power Save Blocker',
  },
  'PowerMonitor.jsx': {
    icon: '🔋',
    title: 'Power Monitor',
  },
  'SystemPreferences.jsx': {
    icon: '⚙️',
    title: 'System Preferences',
  },
};

const IMPORTS_TEMPLATE = `import {
  sectionStyle,
  headerStyle,
  apiLabelStyle,
  descriptionStyle,
  buttonContainerStyle,
  buttonStyle,
  secondaryButtonStyle,
  infoBoxStyle,
  successBoxStyle,
  errorBoxStyle,
  codeBlockStyle,
  badgeStyle,
} from "./sharedStyles";
`;

/**
 * Add hover handlers to a button
 */
function addHoverToButton(buttonText, isSecondary = false) {
  const styleVar = isSecondary ? 'secondaryButtonStyle' : 'buttonStyle';
  const hoverShadow = "0 4px 12px rgba(102, 126, 234, 0.5)";
  const normalShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
  const secondaryHoverBg = "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)";
  const secondaryNormalBg = "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)";
  
  if (isSecondary) {
    return `<button 
          ${buttonText}
          style={${styleVar}}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.background = "${secondaryHoverBg}";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.background = "${secondaryNormalBg}";
          }}
        >`;
  } else {
    return `<button 
          ${buttonText}
          style={${styleVar}}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "${hoverShadow}";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "${normalShadow}";
          }}
        >`;
  }
}

/**
 * Process a single component file
 */
function processComponent(filePath, icon, title) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already updated
  if (content.includes('sharedStyles')) {
    console.log(`  ✓ ${path.basename(filePath)} already updated`);
    return false;
  }
  
  // Add imports if not present
  if (!content.includes('from "./sharedStyles"')) {
    // Find the last import statement
    const importPattern = /(import .*?;)\n(?!import)/g;
    const matches = [...content.matchAll(importPattern)];
    if (matches.length > 0) {
      const lastImportPos = matches[matches.length - 1].index + matches[matches.length - 1][0].length;
      content = content.slice(0, lastImportPos) + '\n' + IMPORTS_TEMPLATE + content.slice(lastImportPos);
    } else {
      // No imports found, add at the beginning
      content = IMPORTS_TEMPLATE + '\n' + content;
    }
  }
  
  // Replace section style
  content = content.replaceAll(
    /<section\s+style=\{\{[^}]+\}\}/g,
    '<section style={sectionStyle}'
  );
  
  // Replace h3/h4 title
  content = content.replaceAll(
    /<h3 style=\{\{[^}]+\}\}>([^<]+)<\/h3>/g,
    `<h3 style={headerStyle}>${icon} $1</h3>`
  );
  
  // Replace API label paragraph
  content = content.replaceAll(
    /<p\s+style=\{\{\s*fontSize:\s*["']12px["'],\s*color:\s*["']white["'],\s*fontStyle:\s*["']italic["'][^}]+\}\}\s*>\s*<strong>APIs?:<\/strong>/g,
    '<div style={apiLabelStyle}>\n        <strong>APIs:</strong>'
  );
  content = content.replaceAll(
    /<\/p>(\s+<p\s+style=\{\{\s*fontSize:\s*["']13px["'])/g,
    '</div>$1'
  );
  
  // Replace description paragraph
  content = content.replaceAll(
    /<p\s+style=\{\{\s*fontSize:\s*["']13px["'],\s*color:\s*["']white["'][^}]+\}\}\s*>/g,
    '<p style={descriptionStyle}>'
  );
  
  // Replace button container div
  content = content.replaceAll(
    /<div\s+style=\{\{\s*display:\s*["']flex["'],\s*gap:\s*\d+,\s*flexWrap:\s*["']wrap["'][^}]+\}\}\s*>/g,
    '<div style={buttonContainerStyle}>'
  );
  
  // Simple button style replacements (will need manual refinement for hover)
  content = content.replaceAll(/<button\s+onClick/g, '<button style={buttonStyle} onClick');
  content = content.replaceAll('<button style={buttonStyle} style={buttonStyle}', '<button style={buttonStyle}');
  
  // Replace pre/code blocks
  content = content.replaceAll(
    /<pre\s+style=\{\{[^}]+\}\}/g,
    '<pre style={codeBlockStyle}'
  );
  
  // Replace status messages with styled boxes
  content = content.replaceAll(
    /<p style=\{\{ marginTop: "[^"]+", color: "[^"]+" \}\}>\s*<strong>Status:<\/strong>/g,
    '<div style={infoBoxStyle}><strong>Status:</strong>'
  );
  content = content.replaceAll(
    /(<div style=\{infoBoxStyle\}><strong>Status:<\/strong>[^<]+)<\/p>/g,
    '$1</div>'
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`  ✓ Updated ${path.basename(filePath)}`);
  return true;
}

/**
 * Main function
 */
function main() {
  const basePath = path.join(__dirname, 'src', 'components', 'sections');
  
  console.log("Updating component files with modern styling...");
  console.log("=".repeat(60));
  
  let updatedCount = 0;
  for (const [filename, props] of Object.entries(COMPONENTS)) {
    const filePath = path.join(basePath, filename);
    if (fs.existsSync(filePath)) {
      if (processComponent(filePath, props.icon, props.title)) {
        updatedCount++;
      }
    } else {
      console.log(`  ✗ ${filename} not found`);
    }
  }
  
  console.log("=".repeat(60));
  console.log(`Updated ${updatedCount} components successfully!`);
  console.log("\nNote: Button hover effects may need manual refinement for conditional styling.");
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { processComponent, addHoverToButton };
