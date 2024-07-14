import { contextBridge, ipcRenderer } from 'electron'
import { EVENTS } from '../service/event'
import type { ILiveStreamOptions } from '../service/live'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('living', {
  liveStreamPush: (opts: ILiveStreamOptions) => ipcRenderer.invoke(EVENTS.LIVE_STREAM_PUSH, opts),
  liveStreamStop: (url: string) => ipcRenderer.invoke(EVENTS.LIVE_STREAM_PUSH_STOP, url),
  isLiveRunning: (url: string) => ipcRenderer.invoke(EVENTS.LIVE_STREAM_PUSH_RUNNING, url),
})
