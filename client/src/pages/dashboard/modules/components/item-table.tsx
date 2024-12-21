import "../../page.sass"
import { useState, useEffect } from "react"
import { BookI, Reservation, Loan, Item, ReservationStatus } from "../../../../types"
import { format } from "date-fns"
import { es } from 'date-fns/locale'
import { useToast } from "../../../../hooks/use-toast"
import { ToastAction } from "../../../../components/ui/toast"
import { catalogApi, Copy, CreateReservationDTO } from "../pages/catalog/catalog.api"
import { booksApi } from "../pages/books/books.api"
import { ItemTableDesktop } from "./item-table-desktop"
import { ItemTableMobile } from "./item-table-mobile"
import { ItemTablePagination } from "./item-table-pagination"
import { ReservationModal } from "../pages/catalog/reserve/reservation-book-modal"
import { EditBookModal } from "../pages/books/edit/edit-book-modal"
import { DeleteBookModal } from "../pages/books/delete/delete-book-modal"
import { LoanConfirmationModal } from "../pages/loan/loan/loan-confirmation-modal"
import { ReservationStatusModal } from "../pages/loan/loan/reservation-status-modal"
import { LoanStatusModal } from "../pages/loan-history/loan-history/loan-status-modal"

interface ItemTableProps {
    items: Item[];
    token: string;
    mode: "books" | "reservations" | "loans" | "loans-history";
    viewMode: "books" | "catalog" | "loan" | "loan-history";
    onLoan?: (item: Item) => void;
    onReturn?: (item: Loan) => void;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    prevPageUrl: string | null;
    nextPageUrl: string | null;
    onReservationConverted?: () => void;
}

export function ItemTable({
    items,
    token,
    mode,
    viewMode,
    onLoan,
    onReturn,
    currentPage,
    totalPages,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    prevPageUrl,
    nextPageUrl,
    onReservationConverted
}: ItemTableProps) {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false)
    const [isLoanConfirmationModalOpen, setIsLoanConfirmationModalOpen] = useState(false)
    const [isReservationStatusModalOpen, setIsReservationStatusModalOpen] = useState(false)
    const [isLoanStatusModalOpen, setIsLoanStatusModalOpen] = useState(false)
    const [copies, setCopies] = useState<Copy[]>([])
    const [isMobile, setIsMobile] = useState(false)
    const { toast } = useToast()

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
        if ((mode === "reservations" || mode === "loans" || mode === "loans-history") && onLoan) {
            onLoan(item)
        } else if ('title' in item) {
            try {
                const data = await catalogApi.getCopies(item.id, token)
                setCopies(data)
                setSelectedItem(item)
                setIsLoanModalOpen(true)
            } catch (error) {
                toast({
                    title: "Error",
                    description: "No se pudieron obtener las copias del libro. Por favor, inténtalo de nuevo.",
                    variant: "destructive",
                })
            }
        }
    }

    const handleReturn = (item: Loan) => {
        if (onReturn) {
            onReturn(item)
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
                status: ReservationStatus.PENDING,
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

    const handleConvertToLoan = (item: Item) => {
        if ('copies' in item && item.status === ReservationStatus.PENDING) {
            setSelectedItem(item)
            setIsLoanConfirmationModalOpen(true)
        } else {
            console.error("Attempted to convert a non-pending reservation or non-reservation item to loan")
            toast({
                title: "Error",
                description: "Solo se pueden convertir a préstamo las reservas pendientes.",
                variant: "destructive",
            })
        }
    }

    const handleReservationStatus = (item: Item) => {
        if ('copies' in item) {
            setSelectedItem(item)
            setIsReservationStatusModalOpen(true)
        } else {
            console.error("Attempted to change status of a non-reservation item")
            toast({
                title: "Error",
                description: "No se puede cambiar el estado de este elemento.",
                variant: "destructive",
            })
        }
    }

    const handleLoanStatus = (item: Item) => {
        if ('copies' in item && 'loanDate' in item) {
            setSelectedItem(item)
            setIsLoanStatusModalOpen(true)
        } else {
            console.error("Attempted to change status of a non-loan item")
            toast({
                title: "Error",
                description: "No se puede cambiar el estado de este elemento.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="item-table">
            {isMobile ? (
                <ItemTableMobile
                    items={items}
                    mode={mode}
                    viewMode={viewMode}
                    onEdit={viewMode === "books" ? handleEdit : undefined}
                    onDelete={viewMode === "books" ? handleDelete : undefined}
                    onReserve={viewMode === "catalog" ? handleReserve : undefined}
                    onLoan={handleLoan}
                    onReturn={mode === "loans" ? handleReturn : undefined}
                    onConvertToLoan={handleConvertToLoan}
                    onReservationStatus={handleReservationStatus}
                    onLoanStatus={handleLoanStatus}
                />
            ) : (
                <ItemTableDesktop
                    items={items}
                    mode={mode}
                    viewMode={viewMode}
                    onEdit={viewMode === "books" ? handleEdit : undefined}
                    onDelete={viewMode === "books" ? handleDelete : undefined}
                    onReserve={viewMode === "catalog" ? handleReserve : undefined}
                    onLoan={handleLoan}
                    onReturn={mode === "loans" ? handleReturn : undefined}
                    onConvertToLoan={handleConvertToLoan}
                    onReservationStatus={handleReservationStatus}
                    onLoanStatus={handleLoanStatus}
                />
            )}
            <ItemTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
                onItemsPerPageChange={onItemsPerPageChange}
                prevPageUrl={prevPageUrl}
                nextPageUrl={nextPageUrl}
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

            {viewMode === "loan" && selectedItem && 'copies' in selectedItem && (
                <>
                    <LoanConfirmationModal
                        isOpen={isLoanConfirmationModalOpen}
                        onClose={() => setIsLoanConfirmationModalOpen(false)}
                        reservation={selectedItem as Reservation}
                        token={token}
                        onConfirm={() => {
                            setIsLoanConfirmationModalOpen(false)
                            if (onReservationConverted) {
                                onReservationConverted()
                            }
                        }}
                        bookTitle={selectedItem.copies[0]?.book.title || 'Libro desconocido'}
                    />
                    <ReservationStatusModal
                        isOpen={isReservationStatusModalOpen}
                        onClose={() => setIsReservationStatusModalOpen(false)}
                        reservation={selectedItem as Reservation}
                        token={token}
                        onConfirm={() => {
                            setIsReservationStatusModalOpen(false)
                            if (onReservationConverted) {
                                onReservationConverted()
                            }
                        }}
                    />
                </>
            )}

            {(viewMode === "loan" || viewMode === "loan-history") && selectedItem && 'loanDate' in selectedItem && (
                <LoanStatusModal
                    isOpen={isLoanStatusModalOpen}
                    onClose={() => setIsLoanStatusModalOpen(false)}
                    loan={selectedItem as Loan}
                    token={token}
                    onConfirm={() => {
                        setIsLoanStatusModalOpen(false)
                        if (onReservationConverted) {
                            onReservationConverted()
                        }
                    }}
                />
            )}
        </div>
    )
}

