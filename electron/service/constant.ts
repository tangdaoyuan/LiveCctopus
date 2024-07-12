import { app } from "electron";
import path from "path";
export const USER_DATA_DIR = app.getPath('userData')

export const USER_DB_DIR = path.join(USER_DATA_DIR, 'teddy_db')

export const USER_STORE_DIR = path.join(USER_DATA_DIR, 'teddy_storage')

export const TEMP_DIR = app.getPath('temp')

export const DEFAULT_MEDIA_STORE_DIR = import.meta.env.VITE_APP_MEDIA_STORE_DIR

export class ResultWrapper {
  static SUCCESS = (msg: string, data?: any) => ({
    code: 0,
    msg,
    data,
  })
  static ERROR = (msg: string) => ({
    code: -1,
    msg,
    data: null,
  })
}
