type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
};
type EventPayloadMapping = {
  statistics: Statistics;
  listFiles: string[];
};

interface Window {
  electron: {
    listFiles: () => Promise<string[]>;
    subscribeStatistics: (callback: (statistics: Statistics) => void) => void;
  };
}
