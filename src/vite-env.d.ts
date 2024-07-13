/// <reference types="vite/client" />

export interface ILivingStream {
  liveStreamPush: (opts: { url: string, target_path: string }) => Promise<any>
  liveStreamStop: (url: string) => Promise<any>
}
export interface ICommon {
  getPlatformInfo: () => any,
  openDir: () => Promise<any>,
  openFile: () => Promise<any>,
}

declare global {
  const __electronLog: Logger.LogFunctions;

  interface Window {
    ipcRenderer: import('electron').IpcRenderer;
    living: ILivingStream;
    common: ICommon;
  }
}
