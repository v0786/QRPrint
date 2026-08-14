const DB_NAME = "qrprint";
const DB_VERSION = 1;

const STORE_NAMES = {
  storeConfig: "storeConfig",
  pricingCache: "pricingCache",
  customerSession: "customerSession",
  unfinishedJobs: "unfinishedJobs",
  documentMetadata: "documentMetadata",
  uploadQueue: "uploadQueue",
  paymentState: "paymentState",
  syncQueue: "syncQueue",
} as const;

export async function openQrPrintDb(): Promise<IDBDatabase> {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      Object.values(STORE_NAMES).forEach((name) => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: "id" });
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
