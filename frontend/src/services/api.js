import axios from 'axios'
import { useUserStore } from '@/stores/userStore'
import router from '@/router'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('kgl-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
    }
    
    // Handle MongoDB connection errors
    if (error.code === 'ECONNREFUSED' || !error.response) {
      console.error('Cannot connect to server. Using local data.')
      // You could trigger a fallback to local data here
    }
    
    return Promise.reject(error)
  }
)

export default apiClient