import axios from 'axios'

import { API } from './constants'

axios.defaults.withCredentials = true

export default axios.create({
  baseURL: API,
  headers: {
    'content-type': 'application/json',
  },
})
