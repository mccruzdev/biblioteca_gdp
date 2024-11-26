'use client'

import React, { useEffect, useState } from 'react'
import { Search, User, LogOut } from 'lucide-react'
import { BACKEND_SERVER } from '../../../../../config/api'
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void
  isMobile: boolean
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, isMobile }) => {
  const [userName, setUserName] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('gdp-bm')
        if (!token) {
          console.error('No token found')
          return
        }

        const response = await fetch(`${BACKEND_SERVER}/user/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setUserName(`${userData.names} ${userData.lastName}`)
        } else {
          console.error('Failed to fetch user data')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('gdp-bm')
    navigate("/");
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
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
        <button
          onClick={toggleDropdown}
          className="user-dropdown-toggle"
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          <User className="user-icon" />
          <span>{userName || 'Usuario'}</span>
        </button>
        {isDropdownOpen && (
          <div className="user-dropdown">
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              <LogOut className="logout-icon" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}