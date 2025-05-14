
// This polyfill adds the necessary globals to fix issues with WalletConnect libraries
// in browser environments that don't have Node.js globals

import { Buffer } from 'buffer';

type MinimalProcess = {
  env: Record<string, string>;
  version: string;
  nextTick: (cb: Function) => void;
};

if (typeof window !== 'undefined') {
  window.global = window;
  // Add Buffer to window
  window.Buffer = window.Buffer || Buffer;
  // Add minimal process object to window
  window.process = window.process || {
    env: {} as Record<string, string>,
    version: '',
    nextTick: function(cb: Function) { setTimeout(cb, 0); }
  } as MinimalProcess;
}
