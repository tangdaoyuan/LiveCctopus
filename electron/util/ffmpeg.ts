//require the ffmpeg package so we can use ffmpeg using JS
import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from "ffmpeg-static"
// import ffprobeStatic from "ffprobe-static"
import Logger from 'electron-log';

//Get the paths to the packaged versions of the binaries we want to use
const ffmpegPath = ffmpegStatic?.replace(
    'app.asar',
    'app.asar.unpacked'
) || '';
// const ffprobePath = ffprobeStatic.path.replace(
//     'app.asar',
//     'app.asar.unpacked'
// );

try {
    Logger.debug(`FFmpegPath: ${ffmpegPath}`)
    //tell the ffmpeg package where it can find the needed binaries.
    ffmpeg.setFfmpegPath(ffmpegPath);
    // ffmpeg.setFfprobePath(ffprobePath);
} catch (error) {
    Logger.error(error)
}


export default ffmpeg
