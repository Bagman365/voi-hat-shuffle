
// This polyfill adds the global object to the window object
// to fix issues with WalletConnect libraries in browser environments
if (typeof window !== 'undefined') {
  window.global = window;
}
