
/// <reference types="vite/client" />

// Add global to window to fix WalletConnect issues
interface Window {
  global: Window;
}

