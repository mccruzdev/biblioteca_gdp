import { useState, useEffect } from "react"
import { ReservationTableDesktop } from "./reserve-table-desktop";
import { ReservationTableMobile } from "./reserve-table-mobile";
import { ReservationTablePagination } from "./reserve-table-pagination";
import { usePagination } from "../hooks/use-pagination";
import { Copy } from "../pages/loan/loan.api";

interface Reservation {
    id: number;
    created: string;
    dueDate: string;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    copies: Copy[];
    bookTitle?: string;
    bookId?: number;
}

interface ReservationTableProps {
    reservations: Reservation[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onLoan: (reservation: Reservation) => void;
}

export function ReservationTable({ reservations, currentPage, totalPages, onPageChange, onLoan }: ReservationTableProps) {
    const [isMobile, setIsMobile] = useState(false)
    const [reservationsPerPage, setReservationsPerPage] = useState(10)

    const {
        currentItems: currentReservations,
        nextPage,
        prevPage,
        goToPage,
    } = usePagination(reservations, reservationsPerPage)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768) // Adjust this breakpoint as needed
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => {
            window.removeEventListener('resize', checkMobile)
        }
    }, [])

    const handleReservationsPerPageChange = (value: string) => {
        setReservationsPerPage(Number(value))
        goToPage(1)
    }

    return (
        <div className="reservation-table">
            {isMobile ? (
                <ReservationTableMobile
                    reservations={currentReservations}
                    onLoan={onLoan}
                />
            ) : (
                <ReservationTableDesktop
                    reservations={currentReservations}
                    onLoan={onLoan}
                />
            )}
            <ReservationTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                reservationsPerPage={reservationsPerPage}
                onPageChange={onPageChange}
                onPrevPage={prevPage}
                onNextPage={nextPage}
                onReservationsPerPageChange={handleReservationsPerPageChange}
            />
        </div>
    )
}


