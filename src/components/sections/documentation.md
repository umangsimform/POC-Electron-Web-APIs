# Section Components - API Documentation

This directory contains modular components for each category section of the Electron Demo application.

---

## Window & App Control

### SystemInfo Component

**Integrated APIs:** `app.getName()`, `app.getVersion()`, `process.platform`, `nativeTheme.shouldUseDarkColors`, `systemPreferences.getAccentColor()`

---

### WindowControls Component

**Integrated APIs:** `BrowserWindow.minimize()`, `BrowserWindow.maximize()`, `BrowserWindow.unmaximize()`, `BrowserWindow.isMaximized()`

---

### DialogShell Component

**Integrated APIs:** `dialog.showOpenDialog()`, `shell.openExternal()`

---

## Window Management

### WindowManagement Component

**Integrated APIs:** `BrowserWindow.setFullScreen()`, `BrowserWindow.isFullScreen()`, `BrowserWindow.setAlwaysOnTop()`, `BrowserWindow.isAlwaysOnTop()`, `BrowserWindow.getBounds()`, `BrowserWindow.setBounds()`, `BrowserWindow.center()`, `BrowserWindow.setResizable()`, `BrowserWindow.isResizable()`

---

### GlobalShortcuts Component

**Integrated APIs:** `globalShortcut.register()`, `globalShortcut.unregister()`, `globalShortcut.isRegistered()`, `Menu.buildFromTemplate()`, `Menu.popup()`

---

## Notifications

### NotificationSection Component

**Integrated APIs:** `Notification`, `Notification.isSupported()`, `Notification.show()`

---

### TraySection Component

**Integrated APIs:** `Tray`, `Tray.setContextMenu()`, `Tray.setToolTip()`, `Tray.setImage()`, `Tray.destroy()`

---

### DockSection Component

**Integrated APIs:** `app.dock.bounce()`, `app.dock.cancelBounce()`, `app.dock.setBadge()`, `app.dock.getBadge()`, `app.dock.setMenu()`, `app.dock.show()`, `app.dock.hide()`

---

## Files & Printing

### NetLogSection Component

**Integrated APIs:** `net.request()`, `netLog.startLogging()`, `netLog.stopLogging()`, `ClientRequest`

---

### SessionSection Component

**Integrated APIs:** `session.defaultSession.clearCache()`, `session.defaultSession.getCacheSize()`, `session.defaultSession.cookies.get()`, `session.defaultSession.cookies.set()`, `session.defaultSession.cookies.remove()`

---

### PrintSection Component

**Integrated APIs:** `webContents.print()`, `webContents.printToPDF()`, `PrintOptions`, `PDFOptions`

---

### InAppPurchase Component

**Integrated APIs:** `inAppPurchase.purchaseProduct()`, `inAppPurchase.getProducts()`, `inAppPurchase.canMakePayments()`, `inAppPurchase.getReceiptURL()`

---

## OS Utilities

### ClipboardSection Component

**Integrated APIs:** `clipboard.readText()`, `clipboard.writeText()`, `clipboard.readImage()`, `clipboard.writeImage()`, `clipboard.clear()`

---

### ScreenSection Component

**Integrated APIs:** `screen.getPrimaryDisplay()`, `screen.getAllDisplays()`, `screen.getDisplayNearestPoint()`, `screen.getCursorScreenPoint()`, `Display` object properties

---

### PowerSaveBlocker Component

**Integrated APIs:** `powerSaveBlocker.start()`, `powerSaveBlocker.stop()`, `powerSaveBlocker.isStarted()`

---

### PowerMonitor Component

**Integrated APIs:** `powerMonitor.on('suspend')`, `powerMonitor.on('resume')`, `powerMonitor.on('on-ac')`, `powerMonitor.on('on-battery')`, `powerMonitor.on('lock-screen')`, `powerMonitor.on('unlock-screen')`

---

### SystemPreferences Component

**Integrated APIs:** `systemPreferences.isDarkMode()`, `systemPreferences.getAccentColor()`, `systemPreferences.getColor()`, `systemPreferences.getSystemColor()`, `nativeTheme.shouldUseDarkColors`, `nativeTheme.on('updated')`

---

## Usage

All components are exported from `index.js` for easy importing:

```jsx
import {
  SystemInfo,
  WindowControls,
  DialogShell,
  WindowManagement,
  GlobalShortcuts,
  NotificationSection,
  TraySection,
  DockSection,
  NetLogSection,
  SessionSection,
  PrintSection,
  InAppPurchase,
  ClipboardSection,
  ScreenSection,
  PowerSaveBlocker,
  PowerMonitor,
  SystemPreferences,
} from "./components/sections";
```

## Component Props

Most components are self-contained with their own state. The only exception is:

- **ClipboardSection** - Accepts `platform` prop for display purposes in clipboard write operations

## Benefits of This Structure

1. **Modularity** - Each component is responsible for a single API category or functionality group
2. **Reusability** - Components can be easily reused across different parts of the application or in other projects
3. **Maintainability** - Easier to locate, update, and debug specific functionality with isolated components
4. **Testing** - Each component can be unit tested independently with mocked Electron APIs
5. **Code Organization** - Clear separation of concerns following single responsibility principle
6. **Documentation** - Self-documenting code structure where file names indicate functionality
7. **Performance** - Components only render when their category is active, reducing unnecessary re-renders

## API Categories Summary

- **Window & App Control** (3 components) - Basic app information and window operations
- **Window Management** (2 components) - Advanced window controls and keyboard shortcuts
- **Notifications** (3 components) - User notification systems across platforms
- **Files & Printing** (4 components) - Network, storage, and document generation
- **OS Utilities** (5 components) - System integration and hardware interaction

Total: **17 independent, reusable components** covering Electron's main API surface
