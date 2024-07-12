import { ipcMain } from 'electron';
import { EVENTS } from './event';
import FFmpeg from '../util/ffmpeg'
import Logger from 'electron-log';
import fs from 'fs-extra'
import path from 'path'
import { uuid } from '../util'
import { ResultWrapper } from './constant';

export interface IMediaOptions {
  input_path: string;
  output_path: string;
  start: string;
  duration: string;
}

export interface IMediaRecordOptions {
  url: string;
  save_dir: string;
  name: string;
  save_path?: string;
  overwrite?: boolean
}

export interface IMediaMergeOptions {
  video_path: string
  audio_path: string
  replace?: boolean
}


export const RECORD_SYMBOL = Symbol()

type RecordMapType = Map<string, FFmpeg.FfmpegCommand>

// Electron IPC Handle
ipcMain.handle(EVENTS.MEDIA_VIDEO_TRIM, async (_, options) => await trimVideo(options))
ipcMain.handle(EVENTS.MEDIA_VIDEO_AUDIO_MERGE, async (_, options) => await mergeVA(options))

// Actually service

async function trimVideo(_opts: IMediaOptions) {
  const { input_path, output_path, start, duration } = _opts;

  let _output_path = ''

  if (!output_path.trim()) { // output not specified

    let _ext_name = path.extname(input_path)
    let i = 0

    while (await fs.pathExists(input_path.replace(_ext_name, `.trim-${i}${_ext_name}`))) {
      i++
    }

    _output_path = input_path.replace(_ext_name, `.trim-${i}${_ext_name}`)
  }

  return await new Promise((resolve) => {
    try {
      const cmd = FFmpeg()
      cmd
        .input(input_path)
        .videoCodec('copy')
        .audioCodec('copy')
        .setStartTime(start)
        .setDuration(duration)
        .on("start", function (commandLine) {
          console.log("Trim Video Start Command: " + commandLine);
        })
        .on('end', function (_stdout, _stderr) {
          resolve({
            code: 0,
            msg: 'Trim Video Success'
          })
        })
        .on('progress', function (progress) {
          Logger.debug(`Processing: ${progress.percent} % done`);
        })
        .on('error', function (err) {
          Logger.error(err)
          resolve({
            code: -1,
            msg: 'Trim Video Failed'
          })
        })
        .saveToFile(_output_path)
    } catch (error) {
      Logger.error(error)
    }
  })
}


async function mergeVA(_opts: IMediaMergeOptions) {
  const { video_path, audio_path, replace = true } = _opts
  return new Promise((resolve) => {
    const _temp_path = `${video_path}-${uuid().slice(0, 6)}`
    const cmd = FFmpeg()
    cmd
      .addInput(video_path)
      .addInput(audio_path)
      .addOptions(['-map 0:v', '-map 1:a', '-c:v copy'])
      .format('mp4')
      .on("start", function (commandLine) {
        console.log("Merge Video & Audio Start Command: " + commandLine);
      })
      .on('error', error => {
        Logger.error(error)
        resolve({
          code: -1,
          msg: 'merge failed'
        })
      })
      .on('end', () => {
        fs.moveSync(_temp_path, video_path, {
          overwrite: true
        })
        fs.removeSync(audio_path)
        resolve({
          code: 0,
          msg: 'merge finished'
        })
      })
      .saveToFile(_temp_path)
  })
}
