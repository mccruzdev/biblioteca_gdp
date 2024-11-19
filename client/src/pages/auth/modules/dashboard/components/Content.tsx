import React, { useRef, useEffect, useState } from 'react'
import { BookTable } from './Table'

interface ContentProps {
  isCollapsed: boolean
  isSidebarOpen: boolean
}

export const Content: React.FC<ContentProps> = ({ isCollapsed, isSidebarOpen }) => {
  const [containerHeight, setContainerHeight] = useState('auto')
  const tableRef = useRef<HTMLDivElement>(null)

  const books = [
    { id: 1, titulo: "El gran Gatsby", numPaginas: 180, autor: "F. Scott Fitzgerald", categoria: "Novela", subcategoria: "Clásico" },
    { id: 2, titulo: "Cien años de soledad", numPaginas: 417, autor: "Gabriel García Márquez", categoria: "Novela", subcategoria: "Realismo mágico" },
    { id: 3, titulo: "1984", numPaginas: 328, autor: "George Orwell", categoria: "Novela", subcategoria: "Distopía" },
    { id: 4, titulo: "Orgullo y prejuicio", numPaginas: 432, autor: "Jane Austen", categoria: "Novela", subcategoria: "Romance" },
    { id: 5, titulo: "Don Quijote de la Mancha", numPaginas: 863, autor: "Miguel de Cervantes", categoria: "Novela", subcategoria: "Clásico" },
    { id: 6, titulo: "Crimen y castigo", numPaginas: 671, autor: "Fiodor Dostoievski", categoria: "Novela", subcategoria: "Psicológica" },
    { id: 7, titulo: "Ulises", numPaginas: 730, autor: "James Joyce", categoria: "Novela", subcategoria: "Modernista" },
    { id: 8, titulo: "Matar a un ruiseñor", numPaginas: 281, autor: "Harper Lee", categoria: "Novela", subcategoria: "Ficción sureña" },
    { id: 9, titulo: "En busca del tiempo perdido", numPaginas: 4215, autor: "Marcel Proust", categoria: "Novela", subcategoria: "Modernista" },
    { id: 10, titulo: "Moby-Dick", numPaginas: 585, autor: "Herman Melville", categoria: "Novela", subcategoria: "Aventura" },
  ]

  useEffect(() => {
    const updateHeight = () => {
      if (tableRef.current) {
        const tableHeight = tableRef.current.offsetHeight
        setContainerHeight(`${tableHeight + 100}px`) // Adding 32px for padding
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)

    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  return (
    <div className={`main-content ${isCollapsed ? 'sidebar-collapsed' : ''} ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <main className="content-area p-4 md:p-6">
        <section className="welcome-section mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">BIBLIOTECA</h1>
          <p className="text-gray-400">
            ¡Bienvenido! Explora y reserva tus libros favoritos
          </p>
        </section>
        <section 
          className="content-section"
          style={{ height: containerHeight, transition: 'height 0.3s ease-in-out' }}
        >
          <div className="p-4 md:p-6 border-b border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold text-white">Catálogo de Libros</h2>
          </div>
          <div className="p-2 md:p-4" ref={tableRef}>
            <BookTable books={books} />
          </div>
        </section>
      </main>
    </div>
  )
}