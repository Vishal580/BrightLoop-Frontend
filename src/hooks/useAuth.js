import { useState, useEffect, createContext, useContext } from "react"
import { api } from "../services/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      // Verify token validity
      api
        .get("/auth/me")
        .then((response) => {
          setUser(response.data.user)
        })
        .catch(() => {
          localStorage.removeItem("token")
          delete api.defaults.headers.common["Authorization"]
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password })
    const { token, user } = response.data

    localStorage.setItem("token", token)
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setUser(user)

    return response.data
  }

  const signup = async (email, password, name) => {
    const response = await api.post("/auth/signup", { email, password, name })
    const { token, user } = response.data

    localStorage.setItem("token", token)
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setUser(user)

    return response.data
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
