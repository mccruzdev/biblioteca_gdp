import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "../../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { useEffect, useState } from 'react'

interface ReservationTablePaginationProps {
    currentPage: number
    totalPages: number
    reservationsPerPage: number
    onPageChange: (page: number) => void
    onPrevPage: () => void
    onNextPage: () => void
    onReservationsPerPageChange: (value: string) => void
}

export function ReservationTablePagination({
    currentPage,
    totalPages,
    reservationsPerPage,
    onPageChange,
    onPrevPage,
    onNextPage,
    onReservationsPerPageChange,
}: ReservationTablePaginationProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
        checkIfMobile()
        window.addEventListener('resize', checkIfMobile)
        return () => window.removeEventListener('resize', checkIfMobile)
    }, [])

    const renderPaginationButtons = () => {
        if (isMobile) {
            return (
                <>
                    <Button
                        key={1}
                        variant={1 === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(1)}
                        className="reservation-table__pagination-button reservation-table__pagination-button--active"
                    >
                        1
                    </Button>
                    {totalPages > 1 && (
                        <Button
                            key={totalPages}
                            variant={totalPages === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(totalPages)}
                            className="reservation-table__pagination-button reservation-table__pagination-button--active"
                        >
                            {totalPages}
                        </Button>
                    )}
                </>
            )
        }

        const buttons = []
        const maxButtons = 7
        let startPage, endPage

        if (totalPages <= maxButtons) {
            startPage = 1
            endPage = totalPages
        } else if (currentPage <= 3) {
            startPage = 2
            endPage = 5
        } else if (currentPage >= totalPages - 2) {
            startPage = totalPages - 4
            endPage = totalPages - 1
        } else {
            startPage = currentPage - 1
            endPage = currentPage + 2
        }

        buttons.push(
            <Button
                key={1}
                variant={1 === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(1)}
                className="reservation-table__pagination-button reservation-table__pagination-button--active"
            >
                1
            </Button>
        )

        if (startPage > 2) {
            buttons.push(<span key="start-ellipsis" className="px-1 py-1 text-xs">...</span>)
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i !== 1 && i !== totalPages) {
                buttons.push(
                    <Button
                        key={i}
                        variant={i === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(i)}
                        className={`reservation-table__pagination-button ${i === currentPage
                            ? "reservation-table__pagination-button--active"
                            : "reservation-table__pagination-button--inactive"
                            }`}
                    >
                        {i}
                    </Button>
                )
            }
        }

        if (endPage < totalPages - 1) {
            buttons.push(<span key="end-ellipsis" className="px-1 py-1 text-xs">...</span>)
        }

        if (totalPages > 1) {
            buttons.push(
                <Button
                    key={totalPages}
                    variant={totalPages === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    className="reservation-table__pagination-button reservation-table__pagination-button--active"
                >
                    {totalPages}
                </Button>
            )
        }

        return buttons
    }

    return (
        <div className="reservation-table__pagination">
            <div className="reservation-table__pagination-info">
                Página {currentPage} de {totalPages}
            </div>
            <div className="reservation-table__pagination-buttons">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onPrevPage}
                    disabled={currentPage === 1}
                    className="reservation-table__pagination-button reservation-table__pagination-button--inactive"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {renderPaginationButtons()}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                    className="reservation-table__pagination-button reservation-table__pagination-button--inactive"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <div className="reservation-table__pagination-select">
                <Select
                    value={reservationsPerPage.toString()}
                    onValueChange={onReservationsPerPageChange}
                >
                    <SelectTrigger className="reservation-table__pagination-select-trigger">
                        <SelectValue placeholder="Filas por página" />
                    </SelectTrigger>
                    <SelectContent className="reservation-table__pagination-select-content">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={pageSize.toString()} className="reservation-table__pagination-select-item">
                                Mostrar {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

