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
import { ReservationModal } from "./reservation-modal"
import { usePagination } from "../hooks/use-pagination"
import { catalogApi, Copy, CreateReservationDTO } from "../catalog.api"

interface BookTableProps {
  books: BookI[]
  token: string
}

export function BookTable({ books, token }: BookTableProps) {
  const [booksPerPage, setBooksPerPage] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BookI | null>(null)
  const [copies, setCopies] = useState<Copy[]>([])
  const { toast } = useToast()

  const {
    currentPage,
    totalPages,
    currentItems: currentBooks,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(books, booksPerPage)

  const handleReserve = async (book: BookI) => {
    try {
      const data = await catalogApi.getCopies(book.id, token);
      setCopies(data);
      setSelectedBook(book);
      setIsModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron obtener las copias del libro. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  }

  const handleConfirmReservation = async (date: Date, time: string, selectedCopy: Copy) => {
    if (!selectedBook || !selectedCopy) return;

    try {
      const reservationData: CreateReservationDTO = {
        dueDate: new Date(date.setHours(parseInt(time.split(':')[0]))).toISOString(),
        status: 'PENDING',
        copies: [selectedCopy.id]
      };

      await catalogApi.createReservation(reservationData, token);

      toast({
        title: "Reserva confirmada",
        description: `Has reservado "${selectedBook.title}" (Copia: ${selectedCopy.code}) para el ${format(date, 'dd/MM/yyyy', { locale: es })} a las ${time}.`,
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

  const renderPaginationButtons = () => {
    const buttons = []
    const maxButtons = 7
    let startPage, endPage

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

    buttons.push(
      <Button
        key={1}
        variant={1 === currentPage ? "default" : "outline"}
        size="sm"
        onClick={() => goToPage(1)}
        className="px-3 py-2 bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90"
      >
        1
      </Button>
    )

    if (startPage > 2) {
      buttons.push(<span key="start-ellipsis" className="px-2 py-2">...</span>)
    }

    for (let i = Math.max(2, startPage); i <= Math.min(endPage, totalPages - 1); i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(i)}
          className={`px-3 py-2 ${i === currentPage
            ? "bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90"
            : "bg-[#141414] text-[#C7C7CC] hover:bg-[#141414] hover:text-[#FFBC24] hover:border-[#FFBC24]"
            }`}
        >
          {i}
        </Button>
      )
    }

    if (endPage < totalPages - 1) {
      buttons.push(<span key="end-ellipsis" className="px-2 py-2">...</span>)
    }

    if (totalPages > 1) {
      buttons.push(
        <Button
          key={totalPages}
          variant={totalPages === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(totalPages)}
          className="px-3 py-2 bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90"
        >
          {totalPages}
        </Button>
      )
    }

    return buttons
  }

  const renderBookCard = (book: BookI) => (
    <Card key={book.id} className="mb-4 border-[#3e3e40] bg-[#0e0e0e] text-[#C7C7CC]">
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>ID:</strong> {book.id}</p>
        <p><strong>Páginas:</strong> {book.pages}</p>
        <p><strong>Autor:</strong> {book.authors[0] ? book.authors[0].name : "Desconocido"}</p>
        <p><strong>Categoría:</strong> {book.category}</p>
        <p><strong>Subcategoría:</strong> {book.subcategory}</p>
        <Button onClick={() => handleReserve(book)} className="mt-2 bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90">
          Reservar
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <>
      <div className="hidden md:block rounded-lg border border-[#3e3e40] bg-[#0e0e0e] p-4">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#3e3e40]">
              <TableHead className="w-[100px] text-[#C7C7CC]">Id</TableHead>
              <TableHead className="text-[#C7C7CC]">Título</TableHead>
              <TableHead className="text-[#C7C7CC]">Páginas</TableHead>
              <TableHead className="text-[#C7C7CC]">Autor</TableHead>
              <TableHead className="text-[#C7C7CC]">Categoría</TableHead>
              <TableHead className="text-[#C7C7CC]">Subcategoría</TableHead>
              <TableHead className="text-right text-[#C7C7CC]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBooks.map((book) => (
              <TableRow key={book.id} className="border-b-[#3e3e40]">
                <TableCell className="font-medium text-[#C7C7CC]">{book.id}</TableCell>
                <TableCell className="text-[#C7C7CC]">{book.title}</TableCell>
                <TableCell className="text-[#C7C7CC]">{book.pages}</TableCell>
                <TableCell className="text-[#C7C7CC]">
                  {book.authors[0] ? book.authors[0].name : "Desconocido"}
                </TableCell>
                <TableCell className="text-[#C7C7CC]">{book.category}</TableCell>
                <TableCell className="text-[#C7C7CC]">{book.subcategory}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-[#C7C7CC] hover:bg-[#141414] hover:text-[#FFBC24]">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0e0e0e] border-[#3e3e40]">
                      <DropdownMenuItem
                        onClick={() => handleReserve(book)}
                        className="cursor-pointer bg-[#FFBC24] text-[#010101] hover:opacity-70 focus:bg-[#FFBC24] focus:text-[#010101] my-1 transition-all active:translate-y-0.5 active:opacity-75"
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

      <div className="md:hidden">
        {currentBooks.map(renderBookCard)}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 space-x-0 sm:space-x-2 py-4">
        <div className="flex-1 text-sm text-[#C7C7CC]">
          Página {currentPage} de {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-2 py-2 bg-[#141414] text-[#C7C7CC] hover:bg-[#141414] hover:text-[#FFBC24] hover:border-[#FFBC24] border-[#3e3e40]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {renderPaginationButtons()}
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-2 py-2 bg-[#141414] text-[#C7C7CC] hover:bg-[#141414] hover:text-[#FFBC24] hover:border-[#FFBC24] border-[#3e3e40]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Select
          value={booksPerPage.toString()}
          onValueChange={(value) => {
            setBooksPerPage(Number(value))
            goToPage(1)
          }}
        >
          <SelectTrigger className="w-[180px] border-[#3e3e40] bg-[#0e0e0e] text-[#C7C7CC]">
            <SelectValue placeholder="Seleccionar filas por página" />
          </SelectTrigger>
          <SelectContent className="bg-[#0e0e0e] border-[#3e3e40]">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()} className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]">
                Mostrar {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmReservation}
        selectedBook={selectedBook}
        copies={copies}
      />
    </>
  )
}


