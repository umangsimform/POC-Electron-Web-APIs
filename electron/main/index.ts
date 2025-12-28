import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  dialog,
  nativeImage,
  BrowserView,
  clipboard,
  screen,
  powerMonitor,
  powerSaveBlocker,
  systemPreferences,
  nativeTheme,
  globalShortcut,
  Menu,
  MenuItem,
  Notification,
  Tray,
  net,
  netLog,
  session,
  inAppPurchase,
} from "electron";
import { release } from "node:os";
import { join } from "node:path";
import { update } from "./update";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  // Apply electron-updater
  update(win);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

// -----------------------------
// App-level helpers
// -----------------------------
ipcMain.handle("app-get-info", async () => {
  return {
    name: app.name,
    version: app.getVersion(),
    path: process.cwd(),
    platform: process.platform,
  };
});

ipcMain.handle("app-get-path", async (_, name: string) => {
  try {
    return app.getPath(name as any);
  } catch (err) {
    return null;
  }
});

ipcMain.handle("app-quit", async () => {
  app.quit();
  return true;
});

// -----------------------------
// Window controls (main window)
// -----------------------------
ipcMain.handle("window-minimize", () => {
  if (win) win.minimize();
});

ipcMain.handle("window-maximize", () => {
  if (win && !win.isMaximized()) win.maximize();
});

ipcMain.handle("window-is-maximized", () => {
  return !!win?.isMaximized();
});

ipcMain.handle("window-restore", () => {
  if (win && win.isMaximized()) win.restore();
});

ipcMain.handle("window-toggle-maximize", () => {
  if (!win) return;
  if (win.isMaximized()) win.restore();
  else win.maximize();
});

ipcMain.handle("window-close", () => {
  if (win) win.close();
});

// -----------------------------
// Dialogs
// -----------------------------
ipcMain.handle("dialog-show-open", async (_, options) => {
  if (!win) return null;
  const result = await dialog.showOpenDialog(win, options || {});
  return result;
});

ipcMain.handle("dialog-show-save", async (_, options) => {
  if (!win) return null;
  const result = await dialog.showSaveDialog(win, options || {});
  return result;
});

ipcMain.handle("dialog-show-message", async (_, options) => {
  if (!win) return null;
  const result = await dialog.showMessageBox(win, options || {});
  return result;
});

// -----------------------------
// Shell
// -----------------------------
ipcMain.handle("shell-open-external", async (_, url: string) => {
  return shell.openExternal(url);
});

ipcMain.handle("shell-open-path", async (_, path: string) => {
  return shell.openPath(path);
});

// -----------------------------
// nativeImage helpers
// -----------------------------
ipcMain.handle("nativeImage-toDataURL", async (_, path: string) => {
  try {
    const image = nativeImage.createFromPath(path);
    return image.toDataURL();
  } catch (err) {
    return null;
  }
});

// -----------------------------
// BrowserView management
// -----------------------------
let _bvId = 1;
const browserViews = new Map<number, BrowserView>();

ipcMain.handle("browserview-create", async (_, { url: viewUrl, bounds }) => {
  if (!win) return null;
  const id = _bvId++;
  const view = new BrowserView({
    webPreferences: { nodeIntegration: false, contextIsolation: true },
  });
  browserViews.set(id, view);
  view.webContents.loadURL(viewUrl);
  win.setBrowserView(view);
  if (bounds && typeof bounds === "object") {
    view.setBounds(bounds);
  } else {
    const [w, h] = win.getSize();
    view.setBounds({ x: 0, y: 60, width: w, height: h - 60 });
  }
  return { id };
});

ipcMain.handle("browserview-destroy", async (_, id: number) => {
  const view = browserViews.get(id);
  if (!view) return false;
  try {
    (view.webContents as any).destroy();
  } catch (e) {
    // ignore
  }
  browserViews.delete(id);
  // If the main window currently has the view, remove it
  if (win) {
    try {
      win.setBrowserView(null as any);
    } catch (e) {
      // ignore
    }
  }
  return true;
});

// -----------------------------
// Clipboard
// -----------------------------
ipcMain.handle("clipboard-read-text", async () => {
  try {
    return clipboard.readText();
  } catch (e) {
    return "";
  }
});

ipcMain.handle("clipboard-write-text", async (_, text: string) => {
  try {
    clipboard.writeText(String(text));
    return true;
  } catch (e) {
    return false;
  }
});

// -----------------------------
// Screen
// -----------------------------
ipcMain.handle("screen-get-primary-display", async () => {
  try {
    return screen.getPrimaryDisplay();
  } catch (e) {
    return null;
  }
});

ipcMain.handle("screen-get-all-displays", async () => {
  try {
    return screen.getAllDisplays();
  } catch (e) {
    return [];
  }
});

ipcMain.handle("screen-get-cursor-point", async () => {
  try {
    return screen.getCursorScreenPoint();
  } catch (e) {
    return { x: 0, y: 0 };
  }
});

// -----------------------------
// powerSaveBlocker
// -----------------------------
ipcMain.handle(
  "power-save-blocker-start",
  async (
    _,
    type:
      | "prevent-display-sleep"
      | "prevent-app-suspension" = "prevent-display-sleep"
  ) => {
    try {
      const id = powerSaveBlocker.start(type as any);
      return id;
    } catch (e) {
      return null;
    }
  }
);

ipcMain.handle("power-save-blocker-stop", async (_, id: number) => {
  try {
    return powerSaveBlocker.stop(Number(id));
  } catch (e) {
    return false;
  }
});

// -----------------------------
// powerMonitor event subscription
// Renderer will register a channel and ask main to forward events to that channel
// -----------------------------
ipcMain.on(
  "power-monitor-subscribe",
  (event, evName: string, replyChannel: string) => {
    try {
      const sender = event.sender;
      const handler = () =>
        sender.send(replyChannel, { event: evName, ts: Date.now() });
      (sender as any).__pm_listeners = (sender as any).__pm_listeners || {};
      (sender as any).__pm_listeners[replyChannel] = handler;
      powerMonitor.on(evName as any, handler);
    } catch (e) {
      // ignore
    }
  }
);

ipcMain.on(
  "power-monitor-unsubscribe",
  (event, evName: string, replyChannel: string) => {
    try {
      const sender = event.sender;
      const handlers = (sender as any).__pm_listeners || {};
      const handler = handlers[replyChannel];
      if (handler) {
        powerMonitor.removeListener(evName as any, handler);
        delete handlers[replyChannel];
      }
    } catch (e) {
      // ignore
    }
  }
);

// -----------------------------
// systemPreferences (basic)
ipcMain.handle("system-preferences-is-dark-mode", async () => {
  try {
    // prefer nativeTheme which is the supported API on newer Electron/TS types
    if (typeof nativeTheme?.shouldUseDarkColors === "boolean") {
      return nativeTheme.shouldUseDarkColors;
    }
    // fallback to systemPreferences at runtime if available (use any to avoid TS type errors)
    if (
      systemPreferences &&
      typeof (systemPreferences as any).isDarkMode === "function"
    ) {
      return (systemPreferences as any).isDarkMode();
    }
    return false;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("system-preferences-get-accent-color", async () => {
  try {
    if (
      systemPreferences &&
      typeof systemPreferences.getAccentColor === "function"
    ) {
      return systemPreferences.getAccentColor();
    }
    return null;
  } catch (e) {
    return null;
  }
});

// -----------------------------
// globalShortcut
// -----------------------------
const registeredShortcuts = new Set<string>();

ipcMain.handle("global-shortcut-register", (event, accelerator: string) => {
  try {
    if (registeredShortcuts.has(accelerator)) {
      return { success: false, error: "Already registered" };
    }
    const success = globalShortcut.register(accelerator, () => {
      event.sender.send("global-shortcut-triggered", { accelerator });
    });
    if (success) {
      registeredShortcuts.add(accelerator);
    }
    return { success, error: success ? null : "Registration failed" };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle("global-shortcut-unregister", (_, accelerator: string) => {
  try {
    globalShortcut.unregister(accelerator);
    registeredShortcuts.delete(accelerator);
    return true;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("global-shortcut-unregister-all", () => {
  try {
    globalShortcut.unregisterAll();
    registeredShortcuts.clear();
    return true;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("global-shortcut-is-registered", (_, accelerator: string) => {
  try {
    return globalShortcut.isRegistered(accelerator);
  } catch (e) {
    return false;
  }
});

// -----------------------------
// Menu & MenuItem
// -----------------------------
ipcMain.handle("menu-build-from-template", (_, template: any) => {
  try {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle("menu-popup", (_, template: any) => {
  try {
    if (!win) return { success: false, error: "No window" };
    const menu = Menu.buildFromTemplate(template);
    menu.popup({ window: win });
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

// -----------------------------
// Extended BrowserWindow APIs
// -----------------------------
ipcMain.handle("window-set-fullscreen", (_, flag: boolean) => {
  try {
    if (win) win.setFullScreen(flag);
    return true;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("window-is-fullscreen", () => {
  try {
    return win?.isFullScreen() ?? false;
  } catch (e) {
    return false;
  }
});

ipcMain.handle(
  "window-set-always-on-top",
  (_, flag: boolean, level?: string) => {
    try {
      if (win) win.setAlwaysOnTop(flag, level as any);
      return true;
    } catch (e) {
      return false;
    }
  }
);

ipcMain.handle("window-is-always-on-top", () => {
  try {
    return win?.isAlwaysOnTop() ?? false;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("window-get-bounds", () => {
  try {
    return win?.getBounds() ?? null;
  } catch (e) {
    return null;
  }
});

ipcMain.handle("window-set-bounds", (_, bounds: any) => {
  try {
    if (win) win.setBounds(bounds);
    return true;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("window-center", () => {
  try {
    if (win) win.center();
    return true;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("window-set-resizable", (_, resizable: boolean) => {
  try {
    if (win) win.setResizable(resizable);
    return true;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("window-is-resizable", () => {
  try {
    return win?.isResizable() ?? false;
  } catch (e) {
    return false;
  }
});

// ============== Notification APIs ==============
ipcMain.handle("notification-show", (_, options: any) => {
  try {
    if (!Notification.isSupported()) {
      return { success: false, error: "Notifications not supported" };
    }
    const notification = new Notification({
      title: options.title || "Notification",
      body: options.body || "",
      icon: options.icon,
      silent: options.silent,
      urgency: options.urgency,
    });
    notification.show();
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle("notification-is-supported", () => {
  return Notification.isSupported();
});

// ============== Tray APIs ==============
let tray: Tray | null = null;

ipcMain.handle("tray-create", (_, iconPath: string) => {
  try {
    if (tray) {
      tray.destroy();
    }
    // Use a default icon if path is empty
    const icon = iconPath || nativeImage.createEmpty();
    tray = new Tray(icon);
    tray.setToolTip("Electron App");
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle("tray-destroy", () => {
  try {
    if (tray) {
      tray.destroy();
      tray = null;
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("tray-set-title", (_, title: string) => {
  try {
    if (tray && process.platform === "darwin") {
      tray.setTitle(title);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("tray-set-tooltip", (_, tooltip: string) => {
  try {
    if (tray) {
      tray.setToolTip(tooltip);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("tray-set-context-menu", (_, menuTemplate: any[]) => {
  try {
    if (tray) {
      const menu = Menu.buildFromTemplate(menuTemplate);
      tray.setContextMenu(menu);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
});

// ============== Dock APIs (macOS only) ==============
ipcMain.handle("dock-bounce", (_, type: "critical" | "informational") => {
  try {
    if (process.platform === "darwin" && app.dock) {
      const id = app.dock.bounce(type);
      return { success: true, id };
    }
    return { success: false, error: "Dock only available on macOS" };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle("dock-cancel-bounce", (_, id: number) => {
  try {
    if (process.platform === "darwin" && app.dock) {
      app.dock.cancelBounce(id);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("dock-set-badge", (_, text: string) => {
  try {
    if (process.platform === "darwin" && app.dock) {
      app.dock.setBadge(text);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("dock-get-badge", () => {
  try {
    if (process.platform === "darwin" && app.dock) {
      return app.dock.getBadge();
    }
    return "";
  } catch (e) {
    return "";
  }
});

ipcMain.handle("dock-hide", () => {
  try {
    if (process.platform === "darwin" && app.dock) {
      app.dock.hide();
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("dock-show", () => {
  try {
    if (process.platform === "darwin" && app.dock) {
      app.dock.show();
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("dock-set-menu", (_, menuTemplate: any[]) => {
  try {
    if (process.platform === "darwin" && app.dock) {
      const menu = Menu.buildFromTemplate(menuTemplate);
      app.dock.setMenu(menu);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
});

// ============== Net & NetLog APIs ==============
ipcMain.handle("net-request", async (_, options: any) => {
  try {
    const request = net.request(options);
    return new Promise((resolve) => {
      let data = "";
      request.on("response", (response) => {
        response.on("data", (chunk) => {
          data += chunk.toString();
        });
        response.on("end", () => {
          resolve({
            success: true,
            statusCode: response.statusCode,
            headers: response.headers,
            data: data,
          });
        });
      });
      request.on("error", (error) => {
        resolve({ success: false, error: error.message });
      });
      request.end();
    });
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle("netlog-start-logging", async (_, path: string) => {
  try {
    await netLog.startLogging(path);
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle("netlog-stop-logging", async () => {
  try {
    const path = await netLog.stopLogging();
    return { success: true, path };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle("netlog-is-logging", () => {
  try {
    return netLog.currentlyLogging;
  } catch (e) {
    return false;
  }
});

// ============== Session APIs ==============
ipcMain.handle("session-clear-cache", async () => {
  try {
    await session.defaultSession.clearCache();
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle("session-clear-storage-data", async (_, options?: any) => {
  try {
    await session.defaultSession.clearStorageData(options);
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle("session-get-cache-size", async () => {
  try {
    const size = await session.defaultSession.getCacheSize();
    return { success: true, size };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle("session-set-proxy", async (_, config: any) => {
  try {
    await session.defaultSession.setProxy(config);
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle("session-get-cookies", async (_, filter?: any) => {
  try {
    const cookies = await session.defaultSession.cookies.get(filter || {});
    return { success: true, cookies };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle("session-set-cookie", async (_, cookie: any) => {
  try {
    await session.defaultSession.cookies.set(cookie);
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle(
  "session-remove-cookie",
  async (_, url: string, name: string) => {
    try {
      await session.defaultSession.cookies.remove(url, name);
      return { success: true };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }
);

// ============== Print API ==============
ipcMain.handle("webcontents-print", async (_, options?: any) => {
  try {
    if (!win) return { success: false, error: "No window available" };

    return new Promise((resolve) => {
      win.webContents.print(options || {}, (success, failureReason) => {
        if (success) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: failureReason });
        }
      });
    });
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle("webcontents-print-to-pdf", async (_, options?: any) => {
  try {
    if (!win) return { success: false, error: "No window available" };

    const data = await win.webContents.printToPDF(options || {});
    return { success: true, data: data.toString("base64") };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

// ============== In-App Purchase API (macOS only) ==============
ipcMain.handle("iap-can-make-payments", () => {
  try {
    if (process.platform === "darwin") {
      return inAppPurchase.canMakePayments();
    }
    return false;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("iap-get-products", async (_, productIDs: string[]) => {
  try {
    if (process.platform === "darwin") {
      const products = await inAppPurchase.getProducts(productIDs);
      return { success: true, products };
    }
    return { success: false, error: "Only available on macOS" };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle(
  "iap-purchase-product",
  async (_, productID: string, quantity?: number) => {
    try {
      if (process.platform === "darwin") {
        const success = await inAppPurchase.purchaseProduct(
          productID,
          quantity
        );
        return { success };
      }
      return { success: false, error: "Only available on macOS" };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }
);

ipcMain.handle("iap-finish-transaction", async (_, transactionID: string) => {
  try {
    if (process.platform === "darwin") {
      inAppPurchase.finishTransactionByDate(transactionID);
      return { success: true };
    }
    return { success: false, error: "Only available on macOS" };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});
