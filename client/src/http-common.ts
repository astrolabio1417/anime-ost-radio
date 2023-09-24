import axios from 'axios'

import { API } from './constants'

axios.defaults.withCredentials = true

export const httpForm = axios.create({
  baseURL: API,
  headers: {
    'content-type': 'multipart/form-data',
  },
})

export default axios.create({
  baseURL: API,
  headers: {
    'content-type': 'application/json',
  },
})
