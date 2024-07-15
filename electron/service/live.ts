import { ipcMain } from 'electron';
import { EVENTS } from './event';
import FFmpeg from '../util/ffmpeg'
import Logger from 'electron-log';
import fs from 'fs-extra'
import path from 'path'
import { uuid } from '../util'
import { ResultWrapper } from './constant';

export interface ILiveStreamOptions {
  url: string
  target_path: string
}

export type LiveMapType = Map<string, FFmpeg.FfmpegCommand>

global.LIVE_SYMBOL = new Map<string, FFmpeg.FfmpegCommand>()

// Electron IPC Handle
ipcMain.handle(EVENTS.LIVE_STREAM_PUSH, async (_, options) => await liveStreamPush(options))
ipcMain.handle(EVENTS.LIVE_STREAM_PUSH_STOP, async (_, url) => await stopLiveStreamPush(url))
ipcMain.handle(EVENTS.LIVE_STREAM_PUSH_RUNNING, async (_, url) => await isLiveRunning(url))


async function isLiveRunning(url: string) {
  return await new Promise(resolve => {
    if (global.LIVE_SYMBOL.has(url)) {
      resolve(true)
    }
    resolve(false)
  })

}


// Actually service
async function liveStreamPush(options: ILiveStreamOptions) {
  const { url, target_path } = options
  return await new Promise(resolve => {
    try {
      const cmd = FFmpeg()
      cmd
        .input(target_path)
        .inputOptions('-re', '-stream_loop', '-1')
        .videoCodec('copy')
        .noAudio()
        .on("start", function (commandLine) {
          Logger.info(`Live Stream Start Command: ${commandLine}`);
          (global.LIVE_SYMBOL).set(url, cmd)
        })
        .on('codecData', function () {
          resolve(ResultWrapper.SUCCESS(''))
        })
        .on('end', function (_stdout, _stderr) {
          Logger.info(`Live Stream End: ${url}`);
          (global.LIVE_SYMBOL).delete(url)
          resolve(ResultWrapper.SUCCESS(''))
        })
        .on('error', function (err) {
          Logger.error(err);
          (global.LIVE_SYMBOL).delete(url)
          resolve(ResultWrapper.ERROR(''))
        })
        .outputFormat('flv')
        .output(url)
        .run()
    } catch (error) {
      Logger.error(error)
      resolve(ResultWrapper.ERROR(''))
    }
  })

}


async function stopLiveStreamPush(url: string) {

  return await new Promise((resolve) => {
    let command: FFmpeg.FfmpegCommand
    try {
      const map = global.LIVE_SYMBOL
      if (map.has(url)) {
        command = map.get(url)!;
        (command as any)?.ffmpegProc.stdin.write('q')
      }
      resolve(ResultWrapper.SUCCESS('Stop Record Video Success'))
    } catch (error) {
      Logger.error(error)
      resolve(ResultWrapper.ERROR(`Stop Record Video Failed: ${error}`))
    } finally {
      (global.LIVE_SYMBOL).delete(url)
    }
  })
}

export async function StopAllLiveStream() {
  for (const url of global.LIVE_SYMBOL.keys()) {
    await stopLiveStreamPush(url)
  }
}
