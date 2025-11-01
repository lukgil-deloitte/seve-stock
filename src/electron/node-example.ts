import { BrowserWindow } from "electron";
import os from "os";

import { ipcWebContentsSend } from "./utils.js";

const pollingInterval = 1000;

export function getCpuModel() {
  return os.cpus()[0].model;
}

export function sendRamUsage(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const totalRam = os.totalmem() / 1024 / 1024 / 1024;
    const freeRam = os.freemem() / 1024 / 1024 / 1024;

    ipcWebContentsSend("ramUsage", mainWindow.webContents, {
      totalRam,
      freeRam
    });
  }, pollingInterval);
}