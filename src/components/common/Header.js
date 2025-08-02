import { useAuth } from "../../hooks/useAuth"

const Header = ({ onMenuClick, sidebarOpen }) => {
  const { user } = useAuth()

  return (
    <header className={`header ${!sidebarOpen ? "header-full-width" : ""}`}>
      <div className="flex items-center gap-4">
        <button className="mobile-menu-toggle" onClick={onMenuClick}>
          ☰
        </button>
        <h1 className="header-title">AI Learning Platform and Progress Tracker</h1>
      </div>

      <div className="user-menu">
        <div className="user-avatar">{user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}</div>
        <span className="font-medium">{user?.name || user?.email}</span>
      </div>
    </header>
  )
}

export default Header