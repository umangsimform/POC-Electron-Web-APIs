import { contextBridge, ipcRenderer } from "electron";
import * as os from "node:os";

function domReady(
  condition: DocumentReadyState[] = ["complete", "interactive"]
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");

  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
  ev.data.payload === "removeLoading" && removeLoading();
};

setTimeout(removeLoading, 4999);
// ----------------------------------------------------------------------
// Small OS helpers (synchronous, from node:os)
// ----------------------------------------------------------------------
const osApi = {
  platform: () => os.platform(),
  arch: () => os.arch(),
  hostname: () => os.hostname(),
  homedir: () => os.homedir(),
  uptime: () => os.uptime(),
  totalmem: () => os.totalmem(),
  freemem: () => os.freemem(),
  cpus: () => os.cpus(),
  loadavg: () => os.loadavg(),
  networkInterfaces: () => os.networkInterfaces(),
};

// ----------------------------------------------------------------------
// Expose async/safe Electron APIs via ipcRenderer.invoke
// These are thin wrappers — heavy lifting is done in the main process.
// ----------------------------------------------------------------------
const electronAPI = {
  // app
  getAppInfo: () => ipcRenderer.invoke("app-get-info"),
  getPath: (name: string) => ipcRenderer.invoke("app-get-path", name),
  quitApp: () => ipcRenderer.invoke("app-quit"),

  // window controls (main window)
  minimize: () => ipcRenderer.invoke("window-minimize"),
  maximize: () => ipcRenderer.invoke("window-maximize"),
  isMaximized: () => ipcRenderer.invoke("window-is-maximized"),
  restore: () => ipcRenderer.invoke("window-restore"),
  toggleMaximize: () => ipcRenderer.invoke("window-toggle-maximize"),
  closeWindow: () => ipcRenderer.invoke("window-close"),
  openWin: (arg: string) => ipcRenderer.invoke("open-win", arg),

  // dialog
  showOpenDialog: (options: any) =>
    ipcRenderer.invoke("dialog-show-open", options),
  showSaveDialog: (options: any) =>
    ipcRenderer.invoke("dialog-show-save", options),
  showMessageBox: (options: any) =>
    ipcRenderer.invoke("dialog-show-message", options),

  // shell
  openExternal: (url: string) => ipcRenderer.invoke("shell-open-external", url),
  openPath: (path: string) => ipcRenderer.invoke("shell-open-path", path),

  // nativeImage
  pathToDataURL: (path: string) =>
    ipcRenderer.invoke("nativeImage-toDataURL", path),

  // BrowserView
  createBrowserView: (url: string, bounds?: any) =>
    ipcRenderer.invoke("browserview-create", { url, bounds }),
  destroyBrowserView: (id: number) =>
    ipcRenderer.invoke("browserview-destroy", id),
  // clipboard
  readClipboardText: () => ipcRenderer.invoke("clipboard-read-text"),
  writeClipboardText: (text: string) =>
    ipcRenderer.invoke("clipboard-write-text", text),

  // screen
  getPrimaryDisplay: () => ipcRenderer.invoke("screen-get-primary-display"),
  getAllDisplays: () => ipcRenderer.invoke("screen-get-all-displays"),
  getCursorPoint: () => ipcRenderer.invoke("screen-get-cursor-point"),

  // powerSaveBlocker
  startPowerSaveBlocker: (
    type?: "prevent-display-sleep" | "prevent-app-suspension"
  ) => ipcRenderer.invoke("power-save-blocker-start", type),
  stopPowerSaveBlocker: (id: number) =>
    ipcRenderer.invoke("power-save-blocker-stop", id),

  // powerMonitor subscribe/unsubscribe helpers
  subscribePowerMonitor: (eventName: string, listener: (data: any) => void) => {
    const replyChannel = `power-monitor-${eventName}-${Math.random()
      .toString(36)
      .slice(2)}`;
    const handler = (_: any, data: any) => listener(data);
    ipcRenderer.on(replyChannel, handler);
    ipcRenderer.send("power-monitor-subscribe", eventName, replyChannel);
    return () => {
      try {
        ipcRenderer.send("power-monitor-unsubscribe", eventName, replyChannel);
        ipcRenderer.removeListener(replyChannel, handler);
      } catch (e) {
        // ignore
      }
    };
  },

  // systemPreferences
  isDarkMode: () => ipcRenderer.invoke("system-preferences-is-dark-mode"),
  getAccentColor: () =>
    ipcRenderer.invoke("system-preferences-get-accent-color"),

  // generic listener helper
  on: (channel: string, listener: (...args: any[]) => void) => {
    const handler = (_: any, ...args: any[]) => listener(...args);
    ipcRenderer.on(channel, handler);
    return () => ipcRenderer.removeListener(channel, handler);
  },

  // globalShortcut
  registerGlobalShortcut: (accelerator: string, callback: () => void) => {
    const handler = (_: any, data: any) => {
      if (data.accelerator === accelerator) callback();
    };
    ipcRenderer.on("global-shortcut-triggered", handler);
    return ipcRenderer
      .invoke("global-shortcut-register", accelerator)
      .then((result: any) => {
        if (!result.success) {
          ipcRenderer.removeListener("global-shortcut-triggered", handler);
        }
        return result;
      });
  },
  unregisterGlobalShortcut: (accelerator: string) =>
    ipcRenderer.invoke("global-shortcut-unregister", accelerator),
  unregisterAllGlobalShortcuts: () =>
    ipcRenderer.invoke("global-shortcut-unregister-all"),
  isGlobalShortcutRegistered: (accelerator: string) =>
    ipcRenderer.invoke("global-shortcut-is-registered", accelerator),

  // Menu
  buildMenuFromTemplate: (template: any) =>
    ipcRenderer.invoke("menu-build-from-template", template),
  popupMenu: (template: any) => ipcRenderer.invoke("menu-popup", template),

  // Extended BrowserWindow APIs
  setFullScreen: (flag: boolean) =>
    ipcRenderer.invoke("window-set-fullscreen", flag),
  isFullScreen: () => ipcRenderer.invoke("window-is-fullscreen"),
  setAlwaysOnTop: (flag: boolean, level?: string) =>
    ipcRenderer.invoke("window-set-always-on-top", flag, level),
  isAlwaysOnTop: () => ipcRenderer.invoke("window-is-always-on-top"),
  getWindowBounds: () => ipcRenderer.invoke("window-get-bounds"),
  setWindowBounds: (bounds: any) =>
    ipcRenderer.invoke("window-set-bounds", bounds),
  centerWindow: () => ipcRenderer.invoke("window-center"),
  setResizable: (resizable: boolean) =>
    ipcRenderer.invoke("window-set-resizable", resizable),
  isResizable: () => ipcRenderer.invoke("window-is-resizable"),

  // Notification
  showNotification: (options: any) =>
    ipcRenderer.invoke("notification-show", options),
  isNotificationSupported: () =>
    ipcRenderer.invoke("notification-is-supported"),

  // Tray
  createTray: (iconPath?: string) =>
    ipcRenderer.invoke("tray-create", iconPath),
  destroyTray: () => ipcRenderer.invoke("tray-destroy"),
  setTrayTitle: (title: string) => ipcRenderer.invoke("tray-set-title", title),
  setTrayTooltip: (tooltip: string) =>
    ipcRenderer.invoke("tray-set-tooltip", tooltip),
  setTrayContextMenu: (menuTemplate: any) =>
    ipcRenderer.invoke("tray-set-context-menu", menuTemplate),

  // Dock (macOS only)
  dockBounce: (type: "critical" | "informational") =>
    ipcRenderer.invoke("dock-bounce", type),
  dockCancelBounce: (id: number) =>
    ipcRenderer.invoke("dock-cancel-bounce", id),
  dockSetBadge: (text: string) => ipcRenderer.invoke("dock-set-badge", text),
  dockGetBadge: () => ipcRenderer.invoke("dock-get-badge"),
  dockHide: () => ipcRenderer.invoke("dock-hide"),
  dockShow: () => ipcRenderer.invoke("dock-show"),
  dockSetMenu: (menuTemplate: any) =>
    ipcRenderer.invoke("dock-set-menu", menuTemplate),

  // Net & NetLog
  netRequest: (options: any) => ipcRenderer.invoke("net-request", options),
  netLogStartLogging: (path: string) =>
    ipcRenderer.invoke("netlog-start-logging", path),
  netLogStopLogging: () => ipcRenderer.invoke("netlog-stop-logging"),
  netLogIsLogging: () => ipcRenderer.invoke("netlog-is-logging"),

  // Session
  sessionClearCache: () => ipcRenderer.invoke("session-clear-cache"),
  sessionClearStorageData: (options?: any) =>
    ipcRenderer.invoke("session-clear-storage-data", options),
  sessionGetCacheSize: () => ipcRenderer.invoke("session-get-cache-size"),
  sessionSetProxy: (config: any) =>
    ipcRenderer.invoke("session-set-proxy", config),
  sessionGetCookies: (filter?: any) =>
    ipcRenderer.invoke("session-get-cookies", filter),
  sessionSetCookie: (cookie: any) =>
    ipcRenderer.invoke("session-set-cookie", cookie),
  sessionRemoveCookie: (url: string, name: string) =>
    ipcRenderer.invoke("session-remove-cookie", url, name),

  // Print
  webContentsPrint: (options?: any) =>
    ipcRenderer.invoke("webcontents-print", options),
  webContentsPrintToPDF: (options?: any) =>
    ipcRenderer.invoke("webcontents-print-to-pdf", options),

  // In-App Purchase (macOS only)
  iapCanMakePayments: () => ipcRenderer.invoke("iap-can-make-payments"),
  iapGetProducts: (productIDs: string[]) =>
    ipcRenderer.invoke("iap-get-products", productIDs),
  iapPurchaseProduct: (productID: string, quantity?: number) =>
    ipcRenderer.invoke("iap-purchase-product", productID, quantity),
  iapFinishTransaction: (transactionID: string) =>
    ipcRenderer.invoke("iap-finish-transaction", transactionID),
};

// Expose to renderer
try {
  contextBridge.exposeInMainWorld("osApi", osApi);
  contextBridge.exposeInMainWorld("electronAPI", electronAPI);
} catch (err) {
  // Fallback for environments where contextBridge isn't available
  // @ts-ignore
  (globalThis as any).osApi = osApi;
  // @ts-ignore
  (globalThis as any).electronAPI = electronAPI;
}
