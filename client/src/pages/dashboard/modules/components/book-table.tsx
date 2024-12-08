import "../../page.sass"
import { useState } from "react"
import { BookI } from "../../../../types"
import { format } from "date-fns"
import { es } from 'date-fns/locale'
import { useToast } from "../../../../hooks/use-toast"
import { ToastAction } from "../../../../components/ui/toast"
import { usePagination } from "../hooks/use-pagination"
import { catalogApi, Copy, CreateReservationDTO } from "../pages/catalog/catalog.api"
import { booksApi } from "../pages/books/books.api"
import { BookTableDesktop } from "./book-table-desktop"
import { BookTableMobile } from "./book-table-mobile"
import { BookTablePagination } from "./book-table-pagination"
import { ReservationModal } from "../pages/catalog/reserve/reservation-book-modal"
import { EditBookModal } from "../pages/books/edit/edit-book-modal"
import { DeleteBookModal } from "../pages/books/delete/delete-book-modal"

interface BookTableProps {
  books: BookI[]
  token: string
  mode: 'crud' | 'reservation'
}

export function BookTable({ books, token, mode }: BookTableProps) {
  const [booksPerPage, setBooksPerPage] = useState(10)
  const [selectedBook, setSelectedBook] = useState<BookI | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
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

  const handleEdit = (book: BookI) => {
    setSelectedBook(book)
    setIsEditModalOpen(true)
  }

  const handleDelete = (book: BookI) => {
    setSelectedBook(book)
    setIsDeleteModalOpen(true)
  }

  const handleReserve = async (book: BookI) => {
    try {
      const data = await catalogApi.getCopies(book.id, token)
      setCopies(data)
      setSelectedBook(book)
      setIsReservationModalOpen(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron obtener las copias del libro. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleEditSubmit = async (data: any) => {
    if (!selectedBook) return

    try {
      const bookData = {
        title: data.title,
        pages: Number(data.pages),
        authors: [{ name: data.author }],
        category: data.category,
        subcategory: data.subcategory,
      }

      await booksApi.updateBook(selectedBook.id, bookData, token)
      toast({
        title: "Éxito",
        description: `El libro "${data.title}" ha sido actualizado`,
      })
      setIsEditModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar el libro",
        variant: "destructive",
      })
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedBook) return

    try {
      await booksApi.deleteBook(selectedBook.id, token)
      toast({
        title: "Éxito",
        description: `El libro "${selectedBook.title}" ha sido eliminado`,
      })
      setIsDeleteModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar el libro",
        variant: "destructive",
      })
    }
  }

  const handleConfirmReservation = async (date: Date, time: string, selectedCopy: Copy) => {
    if (!selectedBook) return

    try {
      const reservationDate = new Date(date)
      const [hours, minutes] = time.split(':').map(Number)
      reservationDate.setHours(hours, minutes)

      const reservationData: CreateReservationDTO = {
        dueDate: reservationDate.toISOString(),
        status: 'PENDING',
        copies: [selectedCopy.id]
      }

      await catalogApi.createReservation(reservationData, token)

      toast({
        title: "Reserva confirmada",
        description: `Has reservado "${selectedBook.title}" (Copia: ${selectedCopy.code || 'N/A'}) para el ${format(reservationDate, 'dd/MM/yyyy HH:mm', { locale: es })}.`,
        action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
      })

      setIsReservationModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un problema al crear la reserva. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <BookTableDesktop
        books={currentBooks}
        mode={mode}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReserve={handleReserve}
      />

      <BookTableMobile
        books={currentBooks}
        mode={mode}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReserve={handleReserve}
      />

      <BookTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        booksPerPage={booksPerPage}
        onPageChange={goToPage}
        onPrevPage={prevPage}
        onNextPage={nextPage}
        onBooksPerPageChange={(value) => {
          setBooksPerPage(Number(value))
          goToPage(1)
        }}
      />

      <EditBookModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        book={selectedBook}
      />

      <DeleteBookModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        onConfirm={handleConfirmReservation}
        selectedBook={selectedBook}
        copies={copies}
      />
    </>
  )
}

