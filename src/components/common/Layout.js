"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {children}
      </div>
      {sidebarOpen && <div className="mobile-overlay active" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}

export default Layout
