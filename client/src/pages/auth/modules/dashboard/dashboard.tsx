import React, { useState } from 'react'
import { Search } from 'lucide-react'
import Icon from './components/icon'

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
    icon: (props: React.SVGProps<SVGSVGElement>) => <Icon type="catalog"/>
  },
  { 
    label: 'Préstamos', 
    href: '/prestamos',
    icon: (props: React.SVGProps<SVGSVGElement>) => <Icon type="loan"/>,
    children: [
      { label: 'Préstamos', href: '/prestamos' },
      { label: 'Historial de Préstamos', href: '/prestamos/historial' }
    ]
  },
  { label: 'Agregar Libros', 
    href: '/agregar-libros', 
    icon: (props: React.SVGProps<SVGSVGElement>) => <Icon type="addBook"/>
  },
  { label: 'Usuarios', 
    href: '/usuarios', 
    icon: (props: React.SVGProps<SVGSVGElement>) => <Icon type="user"/>
  },
  { label: 'Gestión', 
    href: '/gestion', 
    icon: (props: React.SVGProps<SVGSVGElement>) => <Icon type="management"/>
  },
]

const NavLink: React.FC<{ item: NavItem; isCollapsed: boolean }> = ({ item, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = item.icon

  if (item.children && !isCollapsed) {
    return (
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#C7C7CC] transition-colors hover:bg-[#FFBC24] hover:text-black"
        >
          <Icon className="h-4 w-4" />
          <span className="flex-1 text-left">{item.label}</span>
          <span className="ml-auto">{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && (
          <div className="ml-4">
            {item.children.map((child) => (
              <a
                key={child.href}
                href={child.href}
                className="flex w-full items-center px-3 py-2 text-sm text-[#C7C7CC] transition-colors hover:bg-[#FFBC24] hover:text-black"
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
      className={`flex w-full items-center gap-2 px-3 py-2 text-sm text-[#C7C7CC] transition-colors hover:bg-[#FFBC24] hover:text-black ${
        isCollapsed ? 'justify-center' : ''
      }`}
      title={isCollapsed ? item.label : undefined}
    >
      <Icon className="h-4 w-4" />
      {!isCollapsed && <span>{item.label}</span>}
    </a>
  )
}

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(!isSidebarOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0E0E0E]">
      <aside
        className={`fixed left-0 z-40 h-screen transform bg-[rgba(0,0,0,0.9)] transition-all duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        <div className="flex h-20 items-center gap-4 border-b border-[#545457] px-4">
          <button
            onClick={toggleSidebar}
            className="text-[#FFBC24] hover:text-[#ffca52]"
            aria-label="Toggle sidebar"
          >
            <div className="flex h-6 w-8 flex-col justify-between">
              <span className="h-1 w-full bg-current rounded"></span>
              <span className="h-1 w-full bg-current rounded"></span>
              <span className="h-1 w-full bg-current rounded"></span>
            </div>
          </button>
          {!isCollapsed && (
            <img
              src="/logo-muni2.png"
              alt="Logo Municipalidad de Guadalupe"
              className="h-16"
            />
          )}
        </div>
        <div className="flex h-[calc(100vh-6rem)] flex-col">
          <nav className="flex-1 py-4">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} isCollapsed={isCollapsed} />
            ))}
          </nav>
          {!isCollapsed && (
            <div className="border-t border-[#545457] p-4">
              <div className="text-sm text-[#C7C7CC]">
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="ml-auto w-[calc(100%-5rem)] lg:w-[calc(100%-15rem)] pl-8">
        <header
          className="fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-[#2A2A2D] bg-[#0E0E0E] px-4 transition-all duration-200 ease-in-out shadow-md w-[calc(100%-5rem)] lg:w-[calc(100%-18rem)]"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C7C7CC]" />
            <input
              type="search"
              placeholder="Buscar Libro"
              className="h-9 w-full max-w-md rounded-md bg-[#1a1a1a] pl-10 pr-4 text-sm text-[#C7C7CC] placeholder:text-[#C7C7CC] focus:outline-none"
            />
          </div>
          <div className="text-sm text-[#C7C7CC] ml-4">
            Alexander Miguel Chang Cruz
          </div>
        </header>

        <div className="p-6 pt-20">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">BIBLIOTECA</h2>
            <p className="text-[#C7C7CC]">
              ¡Bienvenido! Explora y reserva tus libros favoritos
            </p>
          </div>
          <div className="h-64 rounded-lg bg-[#1a1a1a] p-4 text-[#C7C7CC]">
            Contenido
          </div>
        </div>
      </main>

      {isSidebarOpen && window.innerWidth <= 1024 && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}