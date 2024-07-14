import { app, BrowserWindow, shell, ipcMain, Menu, Tray } from 'electron'
import { IOptions } from './config'
import { StopAllLiveStream } from '../service/live'

export function createTray(opts: IOptions) {
  return async function () {
    let tray = new Tray('resources/tray.png')
    const trayContextMenu = Menu.buildFromTemplate([
      {
        label: '退出',
        // icon: 'resources/exit.png',
        click: () => {
          opts.quitCB()
          StopAllLiveStream().finally(() => {
            app.quit()
          })
        }
      }
    ])
    tray.setToolTip('VA11-hall-A Teddy Created')
    tray.setTitle('Live Cctopus')
    tray.on('click', () => {
      opts.getMainWin()?.show()
    })
    tray.on('right-click', () => {
      tray.popUpContextMenu(trayContextMenu)
    })
  }
}
