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

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`main-content ${!sidebarOpen ? "full-width" : ""}`}>
        <Header onMenuClick={() => setSidebarOpen(open => !open)} />
        {children}
      </div>
      <ChatbotWidget />
    </div>
  )
}

export default Layout
