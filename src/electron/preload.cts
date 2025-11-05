import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  getCompaniesList: async () => ipcInvoke('getCompaniesList'),
  getCompanyStockData: async (ticker, startDate) => ipcInvoke('getCompanyStockData', ticker, startDate)
} satisfies Window["electron"]);

// this happens in UI
function ipcInvoke<Key extends keyof EventPayloadMap>(
  key: Key,
  ...args: any[]
): Promise<EventPayloadMap[Key]> {
  return ipcRenderer.invoke(key, ...args);
}

// function ipcOn<Key extends keyof EventPayloadMap>(
//   key: Key,
//   callback: (payload: EventPayloadMap[Key]) => void
// ) {
//   const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
//   ipcRenderer.on(key, cb);
//   return () => ipcRenderer.off(key, cb);
// }
