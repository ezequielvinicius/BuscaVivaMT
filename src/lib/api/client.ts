import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://abitus-api.geia.vip'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 30000)

// Client MINIMAL sem autenticação/interceptores
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    Accept: 'application/json',
  },
})
