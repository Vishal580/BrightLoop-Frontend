"use client"
import { useAuth } from "../../hooks/useAuth"

const Header = ({ onMenuClick }) => {
  const { user } = useAuth()

  return (
    <header className="header">
      <div className="flex items-center gap-4">
        <button className="mobile-menu-toggle" onClick={onMenuClick}>
          ☰
        </button>
        <h1 className="header-title">Personal Learning Tracker</h1>
      </div>

      <div className="user-menu">
        <div className="user-avatar">{user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}</div>
        <span className="font-medium">{user?.name || user?.email}</span>
      </div>
    </header>
  )
}

export default Header
