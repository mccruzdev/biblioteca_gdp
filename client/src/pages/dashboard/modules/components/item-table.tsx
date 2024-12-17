import "../../page.sass"
import { useState, useEffect } from "react"
import { BookI } from "../../../../types"
import { format } from "date-fns"
import { es } from 'date-fns/locale'
import { useToast } from "../../../../hooks/use-toast"
import { ToastAction } from "../../../../components/ui/toast"
import { usePagination } from "../hooks/use-pagination"
import { catalogApi, Copy, CreateReservationDTO } from "../pages/catalog/catalog.api"
import { booksApi } from "../pages/books/books.api"
import { ItemTableDesktop } from "./item-table-desktop"
import { ItemTableMobile } from "./item-table-mobile"
import { ItemTablePagination } from "./item-table-pagination"
import { ReservationModal } from "../pages/catalog/reserve/reservation-book-modal"
import { EditBookModal } from "../pages/books/edit/edit-book-modal"
import { DeleteBookModal } from "../pages/books/delete/delete-book-modal"

interface Reservation {
    id: number;
    created: string;
    dueDate: string;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    copies: Copy[];
    bookTitle?: string;
    bookId?: number;
}

type Item = BookI | Reservation;

interface ItemTableProps {
    items: Item[];
    token: string;
    mode: "books" | "reservations";
    viewMode: "books" | "catalog" | "loan";
    onLoan?: (item: Item) => void;
}

export function ItemTable({ items, token, mode, viewMode, onLoan }: ItemTableProps) {
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
    const [copies, setCopies] = useState<Copy[]>([])
    const [isMobile, setIsMobile] = useState(false)
    const { toast } = useToast()

    const {
        currentPage,
        totalPages,
        currentItems,
        nextPage,
        prevPage,
        goToPage,
    } = usePagination(items, itemsPerPage)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => {
            window.removeEventListener('resize', checkMobile)
        }
    }, [])

    const handleEdit = (item: BookI) => {
        setSelectedItem(item)
        setIsEditModalOpen(true)
    }

    const handleDelete = (item: BookI) => {
        setSelectedItem(item)
        setIsDeleteModalOpen(true)
    }

    const handleReserve = async (item: BookI) => {
        try {
            const data = await catalogApi.getCopies(item.id, token)
            setCopies(data)
            setSelectedItem(item)
            setIsReservationModalOpen(true)
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudieron obtener las copias del libro. Por favor, inténtalo de nuevo.",
                variant: "destructive",
            })
        }
    }

    const handleLoan = async (item: Item) => {
        if (mode === "reservations" && onLoan) {
            onLoan(item)
        } else if ('title' in item) {
            try {
                const data = await catalogApi.getCopies(item.id, token)
                setCopies(data)
                setSelectedItem(item)
            } catch (error) {
                toast({
                    title: "Error",
                    description: "No se pudieron obtener las copias del libro. Por favor, inténtalo de nuevo.",
                    variant: "destructive",
                })
            }
        }
    }

    const handleEditSubmit = async (data: any) => {
        if (!selectedItem || !('title' in selectedItem)) return

        try {
            const bookData = {
                title: data.title,
                pages: Number(data.pages),
                authors: [{ name: data.author }],
                category: data.category,
                subcategory: data.subcategory,
            }

            await booksApi.updateBook(selectedItem.id, bookData, token)
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
        if (!selectedItem || !('title' in selectedItem)) return

        try {
            await booksApi.deleteBook(selectedItem.id, token)
            toast({
                title: "Éxito",
                description: `El libro "${selectedItem.title}" ha sido eliminado`,
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
        if (!selectedItem || !('title' in selectedItem)) return

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
                description: `Has reservado "${selectedItem.title}" (Copia: ${selectedCopy.code || 'N/A'}) para el ${format(reservationDate, 'dd/MM/yyyy HH:mm', { locale: es })}.`,
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
        <div className="item-table">
            {isMobile ? (
                <ItemTableMobile
                    items={currentItems}
                    mode={mode}
                    viewMode={viewMode}
                    onEdit={viewMode === "books" ? handleEdit : undefined}
                    onDelete={viewMode === "books" ? handleDelete : undefined}
                    onReserve={viewMode === "catalog" ? handleReserve : undefined}
                    onLoan={handleLoan}
                />
            ) : (
                <ItemTableDesktop
                    items={currentItems}
                    mode={mode}
                    viewMode={viewMode}
                    onEdit={viewMode === "books" ? handleEdit : undefined}
                    onDelete={viewMode === "books" ? handleDelete : undefined}
                    onReserve={viewMode === "catalog" ? handleReserve : undefined}
                    onLoan={handleLoan}
                />
            )}
            <ItemTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={goToPage}
                onPrevPage={prevPage}
                onNextPage={nextPage}
                onItemsPerPageChange={(value) => {
                    setItemsPerPage(Number(value))
                    goToPage(1)
                }}
                mode={mode}
            />

            {viewMode === "books" && (
                <>
                    <EditBookModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSubmit={handleEditSubmit}
                        book={selectedItem as BookI}
                    />

                    <DeleteBookModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDeleteConfirm}
                    />
                </>
            )}

            {viewMode === "catalog" && (
                <ReservationModal
                    isOpen={isReservationModalOpen}
                    onClose={() => setIsReservationModalOpen(false)}
                    onConfirm={handleConfirmReservation}
                    selectedBook={selectedItem as BookI}
                    copies={copies}
                />
            )}
        </div>
    )
}

