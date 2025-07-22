"use client"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import Layout from "./components/common/Layout"
import ProtectedRoute from "./components/common/ProtectedRoute"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import AddResource from "./pages/AddResource"
import ResourceDetails from "./pages/ResourceDetails"
import LoadingSpinner from "./components/common/LoadingSpinner"
import { TimeSpentModalProvider } from "./hooks/TimeSpentModalContext"
import TimeSpentModal from "./components/modal/TimeSpentModal"


function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <TimeSpentModalProvider>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/add-resource" element={<AddResource />} />
                  <Route path="/resource/:id" element={<ResourceDetails />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout>
              <TimeSpentModal />
            </TimeSpentModalProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
