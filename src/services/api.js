import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001'

const api = axios.create({ baseURL: BASE, timeout: 60000 })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cg_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

export const predictAPI = {
  predict: (file, onProgress) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/predict', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    })
  },
  history: (limit = 20) => api.get(`/history?limit=${limit}`),
  alternatives: (query, risk = 50) => api.get(`/alternatives/${encodeURIComponent(query)}?risk=${risk}`),
  health: () => api.get('/health'),
}

export default api
