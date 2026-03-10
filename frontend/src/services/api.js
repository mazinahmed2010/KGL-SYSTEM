import axios from 'axios'

// In production, API is on same domain
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - add token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('kgl-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient