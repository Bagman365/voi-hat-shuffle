
// This polyfill is needed for algosdk to work in the browser
if (typeof window !== "undefined") {
  // @ts-ignore
  window.process = {
    env: { REACT_APP_ALGOD_SERVER: "" },
    version: "",
    nextTick: (cb: Function) => {
      setTimeout(cb, 0);
    },
  };

  // @ts-ignore
  window.global = window;
}

export {};
