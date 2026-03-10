import axios from 'axios'

// Use environment variable for API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
})

// Request interceptor - add auth token
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

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout')
      return Promise.reject({ 
        response: { 
          data: { message: 'Request timeout - server not responding' } 
        }
      })
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error')
      return Promise.reject({ 
        response: { 
          data: { message: 'Network error - cannot reach server' } 
        }
      })
    }
    
    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      localStorage.removeItem('kgl-token')
      localStorage.removeItem('kgl-user')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default apiClient