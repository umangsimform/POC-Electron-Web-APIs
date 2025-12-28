/// <reference types="vite/client" />

declare global {
  interface Window {
    // Exposed by the preload script: small OS helpers
    osApi?: {
      platform: () => string;
      arch: () => string;
      hostname: () => string;
      homedir: () => string;
      uptime: () => number;
      totalmem: () => number;
      freemem: () => number;
      cpus: () => NodeJS.CpuInfo[];
      loadavg: () => number[];
      networkInterfaces: () => NodeJS.Dict<NodeJS.NetworkInterfaceInfo[]>;
    };
    // Exposed Electron API (async IPC wrappers)
    electronAPI?: {
      getAppInfo: () => Promise<{
        name: string;
        version: string;
        path: string;
        platform: string;
      }>;
      getPath: (name: string) => Promise<string | null>;
      quitApp: () => Promise<boolean>;

      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      isMaximized: () => Promise<boolean>;
      restore: () => Promise<void>;
      toggleMaximize: () => Promise<void>;
      closeWindow: () => Promise<void>;
      openWin: (arg: string) => Promise<void>;

      showOpenDialog: (options: any) => Promise<any>;
      showSaveDialog: (options: any) => Promise<any>;
      showMessageBox: (options: any) => Promise<any>;

      openExternal: (url: string) => Promise<boolean>;
      openPath: (path: string) => Promise<string>;

      pathToDataURL: (path: string) => Promise<string | null>;

      createBrowserView: (
        url: string,
        bounds?: any
      ) => Promise<{ id: number } | null>;
      destroyBrowserView: (id: number) => Promise<boolean>;
      // clipboard
      readClipboardText: () => Promise<string>;
      writeClipboardText: (text: string) => Promise<boolean>;

      // screen
      getPrimaryDisplay: () => Promise<any>;
      getAllDisplays: () => Promise<any[]>;
      getCursorPoint: () => Promise<{ x: number; y: number }>;

      // powerSaveBlocker
      startPowerSaveBlocker: (
        type?: "prevent-display-sleep" | "prevent-app-suspension"
      ) => Promise<number | null>;
      stopPowerSaveBlocker: (id: number) => Promise<boolean>;

      // powerMonitor (subscribe returns an unsubscribe function)
      subscribePowerMonitor: (
        eventName: string,
        listener: (data: any) => void
      ) => () => void;

      // systemPreferences
      isDarkMode: () => Promise<boolean>;
      getAccentColor: () => Promise<string | null>;

      // generic listener helper
      on?: (channel: string, listener: (...args: any[]) => void) => () => void;

      // globalShortcut
      registerGlobalShortcut?: (
        accelerator: string,
        callback: () => void
      ) => Promise<{ success: boolean; error: string | null }>;
      unregisterGlobalShortcut?: (accelerator: string) => Promise<boolean>;
      unregisterAllGlobalShortcuts?: () => Promise<boolean>;
      isGlobalShortcutRegistered?: (accelerator: string) => Promise<boolean>;

      // Menu
      buildMenuFromTemplate?: (
        template: any
      ) => Promise<{ success: boolean; error?: string }>;
      popupMenu?: (
        template: any
      ) => Promise<{ success: boolean; error?: string }>;

      // Extended BrowserWindow APIs
      setFullScreen?: (flag: boolean) => Promise<boolean>;
      isFullScreen?: () => Promise<boolean>;
      setAlwaysOnTop?: (flag: boolean, level?: string) => Promise<boolean>;
      isAlwaysOnTop?: () => Promise<boolean>;
      getWindowBounds?: () => Promise<any>;
      setWindowBounds?: (bounds: any) => Promise<boolean>;
      centerWindow?: () => Promise<boolean>;
      setResizable?: (resizable: boolean) => Promise<boolean>;
      isResizable?: () => Promise<boolean>;

      // Notification
      showNotification?: (options: {
        title: string;
        body?: string;
        icon?: string;
        silent?: boolean;
        urgency?: "normal" | "critical" | "low";
      }) => Promise<{ success: boolean; error?: string }>;
      isNotificationSupported?: () => Promise<boolean>;

      // Tray
      createTray?: (
        iconPath?: string
      ) => Promise<{ success: boolean; error?: string }>;
      destroyTray?: () => Promise<boolean>;
      setTrayTitle?: (title: string) => Promise<boolean>;
      setTrayTooltip?: (tooltip: string) => Promise<boolean>;
      setTrayContextMenu?: (menuTemplate: any) => Promise<boolean>;

      // Dock (macOS only)
      dockBounce?: (
        type: "critical" | "informational"
      ) => Promise<{ success: boolean; id?: number; error?: string }>;
      dockCancelBounce?: (id: number) => Promise<boolean>;
      dockSetBadge?: (text: string) => Promise<boolean>;
      dockGetBadge?: () => Promise<string>;
      dockHide?: () => Promise<boolean>;
      dockShow?: () => Promise<boolean>;
      dockSetMenu?: (menuTemplate: any) => Promise<boolean>;

      // Net & NetLog
      netRequest?: (options: {
        url: string;
        method?: string;
        headers?: any;
      }) => Promise<{
        success: boolean;
        statusCode?: number;
        headers?: any;
        data?: string;
        error?: string;
      }>;
      netLogStartLogging?: (
        path: string
      ) => Promise<{ success: boolean; error?: string }>;
      netLogStopLogging?: () => Promise<{
        success: boolean;
        path?: string;
        error?: string;
      }>;
      netLogIsLogging?: () => Promise<boolean>;

      // Session
      sessionClearCache?: () => Promise<{ success: boolean; error?: string }>;
      sessionClearStorageData?: (
        options?: any
      ) => Promise<{ success: boolean; error?: string }>;
      sessionGetCacheSize?: () => Promise<{
        success: boolean;
        size?: number;
        error?: string;
      }>;
      sessionSetProxy?: (
        config: any
      ) => Promise<{ success: boolean; error?: string }>;
      sessionGetCookies?: (
        filter?: any
      ) => Promise<{ success: boolean; cookies?: any[]; error?: string }>;
      sessionSetCookie?: (
        cookie: any
      ) => Promise<{ success: boolean; error?: string }>;
      sessionRemoveCookie?: (
        url: string,
        name: string
      ) => Promise<{ success: boolean; error?: string }>;

      // Print
      webContentsPrint?: (
        options?: any
      ) => Promise<{ success: boolean; error?: string }>;
      webContentsPrintToPDF?: (
        options?: any
      ) => Promise<{ success: boolean; data?: string; error?: string }>;

      // In-App Purchase (macOS only)
      iapCanMakePayments?: () => Promise<boolean>;
      iapGetProducts?: (
        productIDs: string[]
      ) => Promise<{ success: boolean; products?: any[]; error?: string }>;
      iapPurchaseProduct?: (
        productID: string,
        quantity?: number
      ) => Promise<{ success: boolean; error?: string }>;
      iapFinishTransaction?: (
        transactionID: string
      ) => Promise<{ success: boolean; error?: string }>;
    };
  }
}

export {};
