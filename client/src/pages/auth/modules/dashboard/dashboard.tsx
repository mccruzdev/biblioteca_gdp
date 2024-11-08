import React, { useState, useEffect } from 'react'
import { Search, ChevronUp, ChevronDown, Gift } from 'lucide-react'
import Icon from './components/Icon'
import './style.sass'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { 
    label: 'Catálogo de libros', 
    href: '/catalogo', 
    icon: (props) => <Icon type="catalog" {...props} />,
  },
  { 
    label: 'Préstamos', 
    href: '/prestamos',
    icon: (props) => <Icon type="loan" {...props} />,
    children: [
      { label: 'Préstamos', href: '/prestamos' },
      { label: 'Historial de Préstamos', href: '/prestamos/historial' }
    ]
  },
  { 
    label: 'Agregar Libros', 
    href: '/agregar-libros', 
    icon: (props) => <Icon type="addBook" {...props} />,
  },
  { 
    label: 'Usuarios', 
    href: '/usuarios', 
    icon: (props) => <Icon type="user" {...props} />,
  },
  { 
    label: 'Gestión', 
    href: '/gestion', 
    icon: (props) => <Icon type="management" {...props} />,
  },
  { 
    label: 'Donaciones', 
    href: '/donaciones',
    icon: Gift,
    children: [
      { label: 'Historial', href: '/donaciones/historial' },
      { label: 'Libros Donados', href: '/donaciones/libros-donados' }
    ]
  },
]

const NavLink: React.FC<{ item: NavItem; isCollapsed: boolean }> = ({ item, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = item.icon
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  if (item.children && !isCollapsed) {
    return (
      <div className="nav-item-with-children">
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`nav-item ${isOpen ? 'open' : ''}`}
          aria-expanded={isOpen}
        >
          <Icon hovered={isHovered} className="nav-icon" />
          <span className="nav-label">{item.label}</span>
          {isOpen ? (
            <ChevronUp className="nav-arrow" aria-hidden="true" />
          ) : (
            <ChevronDown className="nav-arrow" aria-hidden="true" />
          )}
        </button>
        {isOpen && (
          <div className="nav-children">
            {item.children.map((child) => (
              <a
                key={child.href}
                href={child.href}
                className="nav-child-item"
              >
                {child.label}
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <a
      href={item.href}
      className={`nav-item ${isCollapsed ? 'collapsed' : ''}`}
      title={isCollapsed ? item.label : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Icon hovered={isHovered} className="nav-icon" />
      {!isCollapsed && <span className="nav-label">{item.label}</span>}
    </a>
  )
}

const Sidebar: React.FC<{
  isSidebarOpen: boolean
  isCollapsed: boolean
  toggleSidebar: () => void
  isMobile: boolean
}> = ({ isSidebarOpen, isCollapsed, toggleSidebar, isMobile }) => (
  <aside className={`sidebar ${isSidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
    <div className="sidebar-header">
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle"
        aria-label="Toggle sidebar"
      >
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      {!isCollapsed && (
        <img
          src="/logo-muni2.png"
          alt="Logo Municipalidad de Guadalupe"
          className="sidebar-logo"
        />
      )}
    </div>
    <nav className="sidebar-nav">
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.href}>
            <NavLink item={item} isCollapsed={isCollapsed} />
          </li>
        ))}
      </ul>
    </nav>
    {!isCollapsed && (
      <div className="sidebar-footer">
        <div className="footer-content">
          {/* Footer content */}
        </div>
      </div>
    )}
  </aside>
)

const Header: React.FC<{ toggleSidebar: () => void, isMobile: boolean }> = ({ toggleSidebar, isMobile }) => (
  <header className="main-header">
    {isMobile && (
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle mobile-toggle"
        aria-label="Toggle sidebar"
      >
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    )}
    <div className="search-container">
      <Search className="search-icon" />
      <input
        type="search"
        placeholder="Buscar Libro"
        className="search-input"
      />
    </div>
    <div className="user-info">
      Alexander Miguel Chang Cruz
    </div>
  </header>
)

export default function Dashboard() {
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
            Contenido
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