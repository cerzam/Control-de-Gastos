import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // La URL del backend de tus compañeros
})

// Inyecta el token automáticamente si existe en el almacenamiento del navegador
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export default api