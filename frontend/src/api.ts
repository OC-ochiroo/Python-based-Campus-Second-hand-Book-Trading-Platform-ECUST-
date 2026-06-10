import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://backend.railway.internal:8000',
  withCredentials: true,
})

export default api