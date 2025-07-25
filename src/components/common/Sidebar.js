import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { logout } = useAuth()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Add Resource", href: "/add-resource", icon: "➕" },
  ]

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-brand">
        <span style={{ fontSize: "1.5rem" }}>📚</span>
        <h1>BrightLoop</h1>
      </div>

      <nav>
        <ul className="sidebar-nav">
          {navigation.map((item) => (
            <li key={item.name} className="sidebar-nav-item">
              <Link
                to={item.href}
                className={`sidebar-nav-link ${location.pathname === item.href ? "active" : ""}`}
                onClick={onClose}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
        <button
          onClick={handleLogout}
          className="sidebar-nav-link"
          style={{
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
