"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import LoadingSpinner from "./LoadingSpinner"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute
