import { BrowserWindow } from "electron";

export interface IOptions {
  quitCB: Function;
  getMainWin: () => BrowserWindow;
}
