import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)

  // Set default based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false); // closed on mobile
      } else {
        setSidebarOpen(true); // open on desktop
      }
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`main-content ${!sidebarOpen ? "full-width" : ""}`}>
        <Header onMenuClick={() => setSidebarOpen((open) => !open)} />
        {children}
      </div>
    </div>
  );
};

export default Layout;
