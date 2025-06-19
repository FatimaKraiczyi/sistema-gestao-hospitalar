import axios, { AxiosRequestConfig } from 'axios'

import { getToken } from '../utils/helpers/token'

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL
export const api = axios.create({ baseURL: API_BASE_URL })

api.interceptors.request.use(async (config: AxiosRequestConfig) => {
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${getToken()}`,
      ContentType: 'application/json'
    }
  }
})

api.interceptors.request.use(
  async (req) => req,
  (error) => Promise.reject(error)
)
