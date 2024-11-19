import React, { useState } from 'react'
import { ChevronUp, ChevronDown, Gift } from 'lucide-react'
import Icon from './Icon'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { 
    label: 'Catálogo de libros', 
    href: '/dashboard', 
    icon: (props) => <Icon type="catalog" {...props} />,
  },
  { 
    label: 'Préstamos', 
    href: '/dashboard/loan',
    icon: (props) => <Icon type="loan" {...props} />,
    children: [
      { label: 'Préstamos', href: '/dashboard/loan' },
      { label: 'Historial de Préstamos', href: '/dashboard/loan-history' }
    ]
  },
  { 
    label: 'Agregar Libros', 
    href: '/dashboard/add-books', 
    icon: (props) => <Icon type="addBook" {...props} />,
  },
  { 
    label: 'Usuarios', 
    href: '/dashboard/users', 
    icon: (props) => <Icon type="user" {...props} />,
  },
  { 
    label: 'Gestión', 
    href: '/dashboard/management', 
    icon: (props) => <Icon type="management" {...props} />,
  },
  { 
    label: 'Donaciones', 
    href: '/dashboard/donation',
    icon: Gift,
    children: [
      { label: 'Historial', href: '/dashboard/donation-history' },
      { label: 'Libros Donados', href: '/dashboard/donated-books' }
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

interface SidebarProps {
  isSidebarOpen: boolean
  isCollapsed: boolean
  toggleSidebar: () => void
  isMobile: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, isCollapsed, toggleSidebar, isMobile }) => (
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