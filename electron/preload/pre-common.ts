import { contextBridge, dialog, ipcRenderer } from 'electron'
import { EVENTS } from '../service/event'

export const MODULE_NAME = 'common'

const getPlatformInfo = () => ipcRenderer.invoke(EVENTS.COMMON_GET_PLATFORM_INFO)
const openDir = (_params: any) => ipcRenderer.invoke(EVENTS.COMMON_OPEN_DIR_DIALOG, _params)
const openFile = (_params: any) => ipcRenderer.invoke(EVENTS.COMMON_OPEN_FILE_DIALOG, _params)


contextBridge.exposeInMainWorld(MODULE_NAME, {
  getPlatformInfo,
  openDir,
  openFile,
})
