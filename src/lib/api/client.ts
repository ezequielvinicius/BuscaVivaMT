import axios, { AxiosError } from 'axios'
import { refreshToken, getAccessToken, clearTokens } from '@/services/authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://abitus-api.geia.vip'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 30000)

export const api = axios.create({ baseURL: API_BASE_URL, timeout: API_TIMEOUT })

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshing: Promise<any> | null = null
api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config
    const status = error.response?.status

    // tenta refresh apenas 1x
    if (status === 401 && original && !(original as any)._retry) {
      try {
        ;(original as any)._retry = true
        refreshing = refreshing ?? refreshToken()
        await refreshing
        refreshing = null
        return api(original!)
      } catch {
        clearTokens()
      }
    }
    return Promise.reject(error)
  }
)
