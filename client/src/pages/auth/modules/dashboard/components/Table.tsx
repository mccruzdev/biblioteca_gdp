"use client"

import React, { useState, useMemo } from 'react'
import { Table, Button, Dropdown } from "flowbite-react"
import { ChevronUp, ChevronDown, MoreHorizontal, X } from 'lucide-react'

interface Book {
  id: number
  titulo: string
  numPaginas: number
  autor: string
  categoria: string
  subcategoria: string
}

interface BookTableProps {
  books: Book[]
}

export const BookTable: React.FC<BookTableProps> = ({ books }) => {
  const [sortColumn, setSortColumn] = useState<keyof Book | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const sortedBooks = useMemo(() => {
    if (!sortColumn) return books

    return [...books].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [books, sortColumn, sortDirection])

  const handleSort = (column: keyof Book) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ column }: { column: keyof Book }) => {
    if (sortColumn !== column) return null
    return sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  const handleReserve = (book: Book) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  const confirmReservation = () => {
    // Implement reservation logic here
    console.log(`Reserving book: ${selectedBook?.titulo}`)
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <Table striped hoverable className="w-full text-sm text-left text-gray-300 dark:text-gray-300">
          <Table.Head className="text-xs uppercase bg-gray-700 dark:bg-gray-700 text-gray-300 dark:text-gray-300">
            {Object.keys(books[0]).map((key) => (
              <Table.HeadCell 
                key={key}
                className="px-3 py-2 cursor-pointer hover:bg-gray-600 dark:hover:bg-gray-600"
                onClick={() => handleSort(key as keyof Book)}
              >
                <div className="flex items-center">
                  {key}
                  <SortIcon column={key as keyof Book} />
                </div>
              </Table.HeadCell>
            ))}
            <Table.HeadCell className="px-3 py-2">
              <span className="sr-only">Acciones</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y divide-gray-700 dark:divide-gray-700">
            {sortedBooks.map((book) => (
              <Table.Row 
                key={book.id} 
                className="bg-gray-800 dark:bg-gray-800 hover:bg-gray-700 dark:hover:bg-gray-700"
              >
                {Object.values(book).map((value, index) => (
                  <Table.Cell key={index} className="px-3 py-2 whitespace-nowrap">
                    {value}
                  </Table.Cell>
                ))}
                <Table.Cell className="px-3 py-2 whitespace-nowrap text-right">
                  <Dropdown
                    label={<MoreHorizontal className="h-4 w-4" />}
                    dismissOnClick={false}
                    renderTrigger={() => (
                      <Button color="gray" size="xs">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    )}
                  >
                    <Dropdown.Item onClick={() => handleReserve(book)}>
                      Reservar
                    </Dropdown.Item>
                  </Dropdown>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Realiza tu reserva</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Cerrar</span>
              </button>
            </div>
            {selectedBook && (
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Título</p>
                  <p className="text-white">{selectedBook.titulo}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Autor</p>
                  <p className="text-white">{selectedBook.autor}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Categoría</p>
                  <p className="text-white">{selectedBook.categoria}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Subcategoría</p>
                  <p className="text-white">{selectedBook.subcategoria}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Número de páginas</p>
                  <p className="text-white">{selectedBook.numPaginas}</p>
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-3 p-4 border-t border-gray-700">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReservation}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
              >
                Reservar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}