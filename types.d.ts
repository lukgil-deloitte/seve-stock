interface Window {
  electron: {
    getCpuModel: () => Promise<string>;
    subscribeToRamUsage: (
      callback: (ramUsage: RamUsage) => void
    ) => UnsubscribeFn;
    getCheapestDay: () => Promise<string>
  };
}

type RamUsage = {
  totalRam: number;
  freeRam: number;
};

type EventPayloadMap = {
  getCpuModel: string;
  ramUsage: RamUsage;
  getCheapestDay: string;
};

type UnsubscribeFn = () => void;
