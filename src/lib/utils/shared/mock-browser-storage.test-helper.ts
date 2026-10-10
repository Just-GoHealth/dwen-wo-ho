import { vi } from "vitest";

function createStorage(storage: Map<string, string>): Storage {
  return {
    get length() {
      return storage.size;
    },
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    clear: () => {
      storage.clear();
    },
  };
}

/**
 * Stubs `window`, `localStorage` and `sessionStorage` for node-environment
 * tests. Returns the backing map for localStorage.
 */
export function mockBrowserStorage(): Map<string, string> {
  const storage = new Map<string, string>();

  vi.stubGlobal("window", {});
  vi.stubGlobal("localStorage", createStorage(storage));
  vi.stubGlobal("sessionStorage", createStorage(new Map<string, string>()));

  return storage;
}
