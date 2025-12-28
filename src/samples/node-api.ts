import { lstat } from "node:fs/promises";
import { cwd } from "node:process";
import { ipcRenderer } from "electron";

ipcRenderer.on("main-process-message", (_event, ...args) => {
  console.log("[Receive Main-process message]:", ...args);
});

lstat(cwd())
  .then((stats) => {
    console.log("[fs.lstat]", stats);
  })
  .catch((err) => {
    console.error(err);
  });

// Example usage of the new osApi exposed by preload
if (typeof globalThis !== "undefined" && globalThis.osApi) {
  console.log("os.platform()", globalThis.osApi.platform());
  console.log("os.arch()", globalThis.osApi.arch());
  console.log("hostname", globalThis.osApi.hostname());
  console.log("homedir", globalThis.osApi.homedir());
  console.log("uptime (s)", globalThis.osApi.uptime());
  console.log("totalmem", globalThis.osApi.totalmem());
  console.log("freemem", globalThis.osApi.freemem());
  console.log("cpus", globalThis.osApi.cpus());
  console.log("loadavg", globalThis.osApi.loadavg());
  console.log("networkInterfaces", globalThis.osApi.networkInterfaces());
} else {
  console.warn("window.osApi is not available (preload may not be loaded)");
}
