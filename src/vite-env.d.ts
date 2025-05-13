
/// <reference types="vite/client" />

// Polyfill for WalletConnect which requires the global object
interface Window {
  global?: any;
}
