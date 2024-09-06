export const API = `${import.meta.env.VITE_SERVER_URL}/api`
export const RADIO_STREAM = `${import.meta.env.VITE_SERVER_URL}/hls/radio.m3u8`
export const DRAWER_WIDTH = 256
export const RADIO_PLAYLIST_ID = 'LIVE-RADIO'

export const RTC_CONFIG = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
}

export enum PEER_EVENTS {
  UPDATE_USER_LIST = 'update-user-list',
  REMOVE_USER = 'remove-user',
  ADD_USER = 'add-user',
  CALL_MADE = 'call-made',
  ANSWER_MADE = 'answer-made',
}

export enum PEER_OUT_EVENTS {
  LISTENERS = 'listeners',
  UNLISTEN = 'unlisten',
  LISTEN = 'listen',
  CALL_USER = 'call-user',
  MAKE_ANSWER = 'make-answer',
}

export enum RADIO_EVENTS {
  ON_QUEUE_CHANGE = 'ON_QUEUE_CHANGE',
  ON_TRACK_CHANGE = 'ON_TRACK_CHANGE',
}

export const NGINX_HLS_FRAGMENT = 5000 // 5 SECONDS @ live-rtmp.conf
export const MAX_IMAGE_UPLOAD_SIZE = 5 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp']
export const UPLOAD_ERROR_MESSAGE = 'The uploaded file exceeds the maximum allowed size or is not of an accepted type.'

export const MAX_MUSIC_UPLOAD_SIZE = 100 * 1024 * 1024
export const ACCEPTED_MUSIC_TYPES = [
  'audio/mpeg', // MP3
  'audio/wav', // WAV
  'audio/ogg', // OGG Vorbis
  'audio/flac', // FLAC
  'audio/aac', // AAC
]
