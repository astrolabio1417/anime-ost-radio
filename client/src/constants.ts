export const API = `${import.meta.env.VITE_SERVER_URL}/api`
export const RADIO_STREAM = `${import.meta.env.VITE_SERVER_URL}/stream`
export const DRAWER_WIDTH = 240
export const RADIO_PLAYLIST_ID = 'LIVE-RADIO'
export const JSON_HEADER = {
  'Content-Type': 'application/json',
}
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
