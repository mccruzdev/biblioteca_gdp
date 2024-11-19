import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import './style.sass'

export default function Management() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarOpen(false)
        setIsCollapsed(false)
      } else if (window.innerWidth <= 1024) {
        setIsCollapsed(true)
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(true)
        setIsCollapsed(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  return (
    <div className={`dashboard ${isCollapsed ? 'sidebar-collapsed' : ''} ${isSidebarOpen ? 'sidebar-open' : ''} ${isMobile ? 'mobile' : ''}`}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      <div className={`main-content ${isCollapsed ? 'sidebar-collapsed' : ''} ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />
        <main className="content-area">
          <div className="management">
            <h1>Gestión</h1>
            <p>Esta es la página de gestión.</p>
            {/* Add your loan page specific content here */}
          </div>
        </main>
      </div>

      {isSidebarOpen && isMobile && (
        <div
          className="overlay"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}