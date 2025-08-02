import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { authAPI } from "../services/api"
import toast from "react-hot-toast"
import LoadingSpinner from "../components/common/LoadingSpinner"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.login(formData)
      
      // Check if user is verified
      if (response.data.user && !response.data.user.isVerified) {
        toast.error("Please verify your email first")
        
        // Generate new OTP and redirect to verification
        try {
          const otpResponse = await authAPI.generateOTP(response.data.user._id)
          navigate("/verify-otp", {
            state: {
              userId: response.data.user._id,
              email: otpResponse.data.email,
              fromLogin: true
            }
          })
        } catch (otpError) {
          toast.error("Failed to send OTP")
        }
        return
      }

      // User is verified, proceed with login
      await login(formData.email, formData.password)
      toast.success("Login successful!")
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === "Invalid credentials") {
        toast.error("Invalid email or password")
      } else {
        toast.error(error.response?.data?.message || "Login failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="app-name">BrightLoop</h1>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? <LoadingSpinner size="small" /> : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-secondary">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login