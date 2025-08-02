import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { authAPI } from "../services/api"
import { useAuth } from "../hooks/useAuth"
import toast from "react-hot-toast"
import LoadingSpinner from "../components/common/LoadingSpinner"

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()

  // Get user data from navigation state
  const userId = location.state?.userId
  const email = location.state?.email
  const fromLogin = location.state?.fromLogin || false

  useEffect(() => {
    // Redirect if no userId
    if (!userId) {
      navigate("/login")
      return
    }

    // Start countdown for resend
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown, userId, navigate])

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join("")

    if (otpString.length !== 6) {
      toast.error("Please enter complete OTP")
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.verifyOTP(userId, otpString)
      
      if (response.data.result) {
        toast.success("OTP verified successfully!")
        
        // Store token and user data
        localStorage.setItem("token", response.data.token)
        
        // Get user profile
        try {
          const profileResponse = await authAPI.getProfile()
          setUser(profileResponse.data.user)
          navigate("/dashboard")
        } catch (profileError) {
          console.error("Profile fetch error:", profileError)
          navigate("/dashboard")
        }
      } else {
        toast.error("Invalid OTP. Please try again.")
        setOtp(["", "", "", "", "", ""])
        const firstInput = document.getElementById("otp-0")
        if (firstInput) firstInput.focus()
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "OTP verification failed")
      setOtp(["", "", "", "", "", ""])
      const firstInput = document.getElementById("otp-0")
      if (firstInput) firstInput.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return

    setResendLoading(true)

    try {
      await authAPI.generateOTP(userId)
      toast.success("OTP sent successfully!")
      setCountdown(60) // 60 seconds countdown
      setOtp(["", "", "", "", "", ""])
    } catch (error) {
      toast.error("Failed to resend OTP")
    } finally {
      setResendLoading(false)
    }
  }

  const maskEmail = (email) => {
    if (!email) return ""
    const [localPart, domain] = email.split("@")
    const maskedLocal = localPart.charAt(0) + "*".repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1)
    return `${maskedLocal}@${domain}`
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Verify OTP</h1>
          <p className="auth-subtitle">
            We've sent a 6-digit code to{" "}
            <span style={{ fontWeight: "600", color: "var(--primary-color)" }}>
              {maskEmail(email)}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Enter OTP</label>
            <div className="otp-input-container" style={{ 
              display: "flex", 
              gap: "0.5rem", 
              justifyContent: "center",
              marginBottom: "1rem" 
            }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input"
                  style={{
                    width: "3rem",
                    height: "3rem",
                    textAlign: "center",
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    border: "2px solid var(--border-color)",
                    borderRadius: "var(--border-radius)",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary-color)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-color)"
                  }}
                  maxLength={1}
                />
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: "100%" }} 
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : "Verify OTP"}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: "1.5rem" }}>
          <p className="text-sm text-secondary">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendOTP}
              disabled={countdown > 0 || resendLoading}
              className="font-medium"
              style={{
                background: "none",
                border: "none",
                cursor: countdown > 0 ? "not-allowed" : "pointer",
                opacity: countdown > 0 ? 0.5 : 1,
                color: "#dc2626",
              }}
            >
              {resendLoading ? (
                <LoadingSpinner size="small" />
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                "Resend OTP"
              )}
            </button>
          </p>
        </div>

        <div className="text-center" style={{ marginTop: "1rem" }}>
          <button
            onClick={() => navigate(fromLogin ? "/login" : "/signup")}
            className="text-secondary"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              color: "#6366f1",
              fontWeight: "500",
            }}
          >
            ← Back to {fromLogin ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP