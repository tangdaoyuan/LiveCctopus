import { dialog, ipcMain } from 'electron';
import path from 'path'
import { EVENTS } from './event';
import './media'

// Electron IPC Handle
ipcMain.handle(EVENTS.COMMON_OPEN_DIR_DIALOG, async (_, options) => await openDir(options))
ipcMain.handle(EVENTS.COMMON_GET_PLATFORM_INFO, async () => {
  return {
    sep: path.sep,
    delimiter: path.delimiter
  }
})

const openDir = async (_params: any) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })

  const ret = {
    cancel: false,
    dir_path: ''
  }

  if (result.canceled) {
    ret.cancel = true
    return ret
  }
  const dir = result.filePaths?.[0]
  if (!dir) {
    return ret
  }

  ret.dir_path = dir
  return ret
}
