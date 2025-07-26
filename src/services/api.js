import axios from "axios"
import toast from "react-hot-toast"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }

    const message = error.response?.data?.message || "An error occurred"
    toast.error(message)

    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  signup: (userData) => api.post("/auth/signup", userData),
  getProfile: () => api.get("/auth/me"),
}

// Resources API
export const resourcesAPI = {
  getAll: () => api.get("/resources"),
  getById: (id) => api.get(`/resources/${id}`),
  create: (data) => api.post("/resources", data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
  markComplete: (id, data) => api.post(`/resources/${id}/mark-complete`, data),
  getSummary: () => api.get("/resources/summary"),
}

// Categories API
export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  create: (data) => api.post("/categories", data),
}

// Chat API
export const chatAPI = {
  chat: (message) => api.post("/chat", { message }),
}
