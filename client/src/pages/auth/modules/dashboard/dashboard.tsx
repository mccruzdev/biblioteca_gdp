import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import './style.sass'

export function Dashboard() {
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
          <section className="welcome-section">
            <h1>BIBLIOTECA</h1>
            <p>
              ¡Bienvenido! Explora y reserva tus libros favoritos
            </p>
          </section>
          <section className="content-section">
            Contenido del Dashboard
          </section>
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