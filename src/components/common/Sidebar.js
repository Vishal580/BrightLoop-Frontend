import { Link, useLocation } from "react-router-dom"
import React, { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import Modal from "../common/Modal"

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { logout } = useAuth()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Add Resource", href: "/add-resource", icon: "➕" },
  ]

  const [showlogoutModal, setShowLogoutModal] = useState(false)
  const handleLogout = () => {
    logout()
    setShowLogoutModal(false)
  }

  // const handleLogout = () => {
  //   logout()
  // }

  return (
    <>
    <div className={`sidebar ${isOpen ? "open" : "closed"}`} style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div>
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
      </div>

      {/* Logout button at the bottom */}
      <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
        <button
          onClick={() => setShowLogoutModal(true)}
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
          <Modal open={showlogoutModal} onClose={() => setShowLogoutModal(false)}>
        <div>
          <h2 style={{ fontWeight: 600, fontSize: "1.2rem", marginBottom: "1.5rem" }}>
            Are you sure you want to Logout?
          </h2>
          <div className="flex gap-4 justify-center">
            <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Sidebar
