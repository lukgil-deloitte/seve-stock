interface Window {
  electron: {
    getCpuModel: () => Promise<string>;
    subscribeToRamUsage: (
      callback: (ramUsage: RamUsage) => void
    ) => UnsubscribeFn;
  };
}

type RamUsage = {
  totalRam: number;
  freeRam: number;
};

type EventPayloadMap = {
  getCpuModel: string;
  ramUsage: RamUsage;
};

type UnsubscribeFn = () => void;
