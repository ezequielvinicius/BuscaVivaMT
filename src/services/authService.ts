import { api } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'

type Creds = { login: string; password: string }

const ACCESS = 'accessToken'
const REFRESH = 'refreshToken'

export function getAccessToken() {
  return localStorage.getItem(ACCESS)
}
export function setTokens({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
  localStorage.setItem(ACCESS, accessToken)
  localStorage.setItem(REFRESH, refreshToken)
}
export function clearTokens() {
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(REFRESH)
}

export async function login(creds: Creds) {
  const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN, creds)
  // Swagger diz que retorna accessToken e refreshToken
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
  return data
}

export async function refreshToken() {
  const token = localStorage.getItem(REFRESH) || localStorage.getItem(ACCESS)
  if (!token) throw new Error('No refresh token')
  const { data } = await api.post(
    API_ENDPOINTS.AUTH.REFRESH,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  )
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
  return data
}
