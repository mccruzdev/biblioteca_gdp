import React from 'react'
import { Search } from 'lucide-react'

interface HeaderProps {
  toggleSidebar: () => void
  isMobile: boolean
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, isMobile }) => (
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
      Usuario
    </div>
  </header>
)