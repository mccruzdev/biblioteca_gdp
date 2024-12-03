import { useState } from "react"
import { MoreHorizontal, ChevronLeft, ChevronRight, CalendarIcon, Check } from 'lucide-react'
import { BookI } from "../../../../../../types"
import { format } from "date-fns"
import { es } from 'date-fns/locale'
import { Calendar } from "../../../../../../components/ui/calendar"
import { cn } from "../../../../../../lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../../components/ui/table"
import { Button } from "../../../../../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../../../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../../components/ui/popover"
import { Label } from "../../../../../../components/ui/label"
import { useToast } from "../../../../../../hooks/use-toast"
import { ToastAction } from "../../../../../../components/ui/toast"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card"

interface BookTableProps {
  books: BookI[]
}

export function BookTable({ books }: BookTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [booksPerPage, setBooksPerPage] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BookI | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const { toast } = useToast()

  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook)

  const totalPages = Math.ceil(books.length / booksPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleReserve = (book: BookI) => {
    setSelectedBook(book)
    setSelectedDate(undefined)
    setSelectedTime(undefined)
    setIsModalOpen(true)
  }

  const handleConfirmReservation = () => {
    if (!selectedBook || !selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Por favor, selecciona una fecha y hora para la reserva.",
        variant: "destructive",
      })
      return
    }

    console.log('Reserva confirmada:', {
      book: selectedBook.title,
      date: format(selectedDate, 'dd/MM/yyyy', { locale: es }),
      time: selectedTime
    })

    toast({
      title: "Reserva confirmada",
      description: `Has reservado "${selectedBook.title}" para el ${format(selectedDate, 'dd/MM/yyyy', { locale: es })} a las ${selectedTime}.`,
      action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
    })

    setIsModalOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setIsCalendarOpen(false)
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const maxButtons = 7 // Número máximo de botones a mostrar
    let startPage, endPage

    if (totalPages <= maxButtons) {
      // Mostrar todos los botones si hay menos páginas que el máximo
      startPage = 1
      endPage = totalPages
    } else if (currentPage <= Math.ceil(maxButtons / 2)) {
      // Estamos cerca del inicio
      startPage = 1
      endPage = maxButtons - 2
    } else if (currentPage >= totalPages - Math.floor(maxButtons / 2)) {
      // Estamos cerca del final
      startPage = totalPages - maxButtons + 3
      endPage = totalPages
    } else {
      // Estamos en el medio
      startPage = currentPage - Math.floor((maxButtons - 4) / 2)
      endPage = currentPage + Math.ceil((maxButtons - 4) / 2)
    }

    // Siempre mostrar la primera página
    buttons.push(
      <Button
        key={1}
        variant={1 === currentPage ? "default" : "outline"}
        size="sm"
        onClick={() => setCurrentPage(1)}
        className="px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        1
      </Button>
    )

    // Añadir elipsis si es necesario
    if (startPage > 2) {
      buttons.push(
        <span key="start-ellipsis" className="px-2 py-2">
          ...
        </span>
      )
    }

    // Añadir páginas intermedias
    for (let i = Math.max(2, startPage); i <= Math.min(endPage, totalPages - 1); i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 ${i === currentPage
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
        >
          {i}
        </Button>
      )
    }

    // Añadir elipsis si es necesario
    if (endPage < totalPages - 1) {
      buttons.push(
        <span key="end-ellipsis" className="px-2 py-2">
          ...
        </span>
      )
    }

    // Siempre mostrar la última página si hay más de una página
    if (totalPages > 1) {
      buttons.push(
        <Button
          key={totalPages}
          variant={totalPages === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          className="px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {totalPages}
        </Button>
      )
    }

    return buttons
  }

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
      <div className="hidden md:block"> {/* Desktop view */}
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

      <div className="md:hidden"> {/* Mobile view */}
        {currentBooks.map(renderBookCard)}
      </div>

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
        <Select
          value={booksPerPage.toString()}
          onValueChange={(value) => {
            setBooksPerPage(Number(value))
            setCurrentPage(1)
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Realiza tu reserva</DialogTitle>
            <DialogDescription>
              {selectedBook && (
                <p>Selecciona la fecha y hora de recojo para el libro "{selectedBook.title}"</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Fecha de recojo</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    locale={es}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                  {selectedDate && (
                    <div className="p-2 flex justify-end">
                      <Button size="sm" className="w-full" onClick={() => setIsCalendarOpen(false)}>
                        <Check className="mr-2 h-4 w-4" />
                        Aceptar
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Hora de recojo</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Selecciona una hora" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 9 }, (_, i) => i + 9).map((hour) => (
                    <SelectItem key={hour} value={`${hour}:00`}>
                      {`${hour}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmReservation} disabled={!selectedDate || !selectedTime}>
              Reservar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

