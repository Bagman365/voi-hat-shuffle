
/// <reference types="vite/client" />

// Add global to window to fix WalletConnect issues
interface Window {
  global: Window;
  Buffer: typeof Buffer;
  process: {
    env: Record<string, string>;
    version: string;
    nextTick: (callback: Function) => void;
  };
}
