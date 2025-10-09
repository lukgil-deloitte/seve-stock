import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  getCpuModel: () => ipcInvoke("getCpuModel"),
  subscribeToRamUsage: (callback) => {
    return ipcOn("ramUsage", (ramUsage) => callback(ramUsage));
  },
  getCheapestDay: () => ipcInvoke('getCheapestDay')
} satisfies Window["electron"]);

function ipcInvoke<Key extends keyof EventPayloadMap>(
  key: Key
): Promise<EventPayloadMap[Key]> {
  return ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMap>(
  key: Key,
  callback: (payload: EventPayloadMap[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  ipcRenderer.on(key, cb);
  return () => ipcRenderer.off(key, cb);
}
