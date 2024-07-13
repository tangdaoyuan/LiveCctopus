export const EVENTS = {
  OPEN_AUDIO_WIN: 'open:audio:window',
  STOP_AUDIO_WIN: 'stop:audio:window',
  COMMON_OPEN_DIR_DIALOG: 'common:open:dir:dialog',
  COMMON_OPEN_FILE_DIALOG: 'common:open:file:dialog',
  COMMON_GET_PLATFORM_INFO: 'common:get:platform_info',
  NOTIFICATION_SHOW: 'notification:show',
  MEDIA_VIDEO_TRIM: 'media:video:trim',
  MEDIA_VIDEO_AUDIO_MERGE: 'media:video:audio:merge',
  LIVE_STREAM_PUSH: 'live:stream:push',
  LIVE_STREAM_PUSH_STOP: 'live:stream:push:stop',
  GLOBAL_CONF_UPDATE: 'global_conf:update',
  GLOBAL_CONF_GET: 'global_conf:get',
} as const

