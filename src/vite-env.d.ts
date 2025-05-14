
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ALGOD_SERVER: string;
  // add more env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare interface Window {
  process: any;
  global: any;
}
