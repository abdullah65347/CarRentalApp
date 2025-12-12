import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
})

// attach token from localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = 'Bearer ' + token
    return config
})

// global response interceptor
api.interceptors.response.use(
    (res) => res,
    (err) => {
        // optional: handle 401 globally
        return Promise.reject(err)
    }
)

export default api