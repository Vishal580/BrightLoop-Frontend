import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import ChatbotWidget from "./ChatbotWidget"

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className={`main-content ${!sidebarOpen ? "full-width" : ""}`}>
        <Header 
          onMenuClick={toggleSidebar} 
          sidebarOpen={sidebarOpen} 
        />
        {children}
      </div>
      <ChatbotWidget />
    </div>
  )
}

export default Layout