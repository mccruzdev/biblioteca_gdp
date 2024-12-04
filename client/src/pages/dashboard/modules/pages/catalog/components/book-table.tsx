import { useState } from "react"
import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { BookI } from "../../../../../../types"
import { format } from "date-fns"
import { es } from 'date-fns/locale'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../../components/ui/table"
import { Button } from "../../../../../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../../../components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select"
import { useToast } from "../../../../../../hooks/use-toast"
import { ToastAction } from "../../../../../../components/ui/toast"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card"
import { BACKEND_SERVER } from "../../../../../../config/api"
import { ReservationModal } from "./reservation-modal"
import { usePagination } from "../hooks/use-pagination"

interface BookTableProps {
  books: BookI[]
  token: string
}

interface CreateReservationDTO {
  dueDate: string;
  status: string;
  copies: number[];
}

export function BookTable({ books, token }: BookTableProps) {
  // Estado local para el número de libros por página y el modal de reserva
  const [booksPerPage, setBooksPerPage] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BookI | null>(null)
  const { toast } = useToast()

  // Hook personalizado de paginación
  const {
    currentPage,
    totalPages,
    currentItems: currentBooks,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(books, booksPerPage)

  // Manejar la acción de reservar un libro
  const handleReserve = (book: BookI) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  // Crear una reserva en el servidor
  const createReservation = async (data: CreateReservationDTO) => {
    if (!token) {
      throw new Error('Token de autorización no disponible');
    }

    const response = await fetch(`${BACKEND_SERVER}/reservation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create reservation');
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : null;
  }

  // Manejar la confirmación de una reserva
  const handleConfirmReservation = async (date: Date, time: string) => {
    if (!selectedBook) return;

    try {
      const reservationData: CreateReservationDTO = {
        dueDate: new Date(date.setHours(parseInt(time.split(':')[0]))).toISOString(),
        status: 'PENDING',
        copies: [selectedBook.id]
      };

      await createReservation(reservationData);

      toast({
        title: "Reserva confirmada",
        description: `Has reservado "${selectedBook.title}" para el ${format(date, 'dd/MM/yyyy', { locale: es })} a las ${time}.`,
        action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
      })

      setIsModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un problema al crear la reserva. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Renderizar los botones de paginación
  const renderPaginationButtons = () => {
    const buttons = []
    const maxButtons = 7
    let startPage, endPage

    // Lógica para determinar qué botones de página mostrar
    if (totalPages <= maxButtons) {
      startPage = 1
      endPage = totalPages
    } else if (currentPage <= Math.ceil(maxButtons / 2)) {
      startPage = 1
      endPage = maxButtons - 2
    } else if (currentPage >= totalPages - Math.floor(maxButtons / 2)) {
      startPage = totalPages - maxButtons + 3
      endPage = totalPages
    } else {
      startPage = currentPage - Math.floor((maxButtons - 4) / 2)
      endPage = currentPage + Math.ceil((maxButtons - 4) / 2)
    }

    // Añadir el botón para la primera página
    buttons.push(
      <Button
        key={1}
        variant={1 === currentPage ? "default" : "outline"}
        size="sm"
        onClick={() => goToPage(1)}
        className="px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        1
      </Button>
    )

    // Añadir elipsis si es necesario
    if (startPage > 2) {
      buttons.push(<span key="start-ellipsis" className="px-2 py-2">...</span>)
    }

    // Añadir botones para las páginas intermedias
    for (let i = Math.max(2, startPage); i <= Math.min(endPage, totalPages - 1); i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(i)}
          className={`px-3 py-2 ${i === currentPage
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
        >
          {i}
        </Button>
      )
    }

    // Añadir elipsis final si es necesario
    if (endPage < totalPages - 1) {
      buttons.push(<span key="end-ellipsis" className="px-2 py-2">...</span>)
    }

    // Añadir botón para la última página
    if (totalPages > 1) {
      buttons.push(
        <Button
          key={totalPages}
          variant={totalPages === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(totalPages)}
          className="px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {totalPages}
        </Button>
      )
    }

    return buttons
  }

  // Renderizar una tarjeta de libro (móvil)
  const renderBookCard = (book: BookI) => (
    <Card key={book.id} className="mb-4">
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>ID:</strong> {book.id}</p>
        <p><strong>Páginas:</strong> {book.pages}</p>
        <p><strong>Autor:</strong> {book.authors[0] ? book.authors[0].name : "Desconocido"}</p>
        <p><strong>Categoría:</strong> {book.category}</p>
        <p><strong>Subcategoría:</strong> {book.subcategory}</p>
        <Button onClick={() => handleReserve(book)} className="mt-2">
          Reservar
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <>
      {/* Vista de escritorio */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Páginas</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Subcategoría</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.id}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.pages}</TableCell>
                <TableCell>
                  {book.authors[0] ? book.authors[0].name : "Desconocido"}
                </TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>{book.subcategory}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleReserve(book)}
                        className="cursor-pointer"
                      >
                        Reservar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Vista móvil */}
      <div className="md:hidden">
        {currentBooks.map(renderBookCard)}
      </div>

      {/* Controles de paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 space-x-0 sm:space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-2 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {renderPaginationButtons()}
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-2 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {/* Selector de libros por página */}
        <Select
          value={booksPerPage.toString()}
          onValueChange={(value) => {
            setBooksPerPage(Number(value))
            goToPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar filas por página" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                Mostrar {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Modal de reserva */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmReservation}
        selectedBook={selectedBook}
      />
    </>
  )
}

