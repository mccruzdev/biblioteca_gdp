import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "../../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"

interface BookTablePaginationProps {
    currentPage: number
    totalPages: number
    booksPerPage: number
    onPageChange: (page: number) => void
    onPrevPage: () => void
    onNextPage: () => void
    onBooksPerPageChange: (value: string) => void
}

export function BookTablePagination({
    currentPage,
    totalPages,
    booksPerPage,
    onPageChange,
    onPrevPage,
    onNextPage,
    onBooksPerPageChange,
}: BookTablePaginationProps) {
    const renderPaginationButtons = () => {
        const buttons = []
        const isMobile = window.innerWidth < 640 
        const maxButtons = isMobile ? 5 : 7 
        let startPage, endPage

        if (totalPages <= maxButtons) {
            startPage = 1
            endPage = totalPages
        } else if (currentPage <= 2) {
            startPage = 2
            endPage = isMobile ? 4 : 5
        } else if (currentPage >= totalPages - 1) {
            startPage = isMobile ? totalPages - 3 : totalPages - 4
            endPage = totalPages - 1
        } else {
            startPage = currentPage - 1
            endPage = isMobile ? currentPage + 1 : currentPage + 2
        }

        buttons.push(
            <Button
                key={1}
                variant={1 === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(1)}
                className="px-2 py-1 text-xs bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90"
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
                        className={`px-1 sm:px-2 py-1 text-xs ${i === currentPage
                            ? "bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90"
                            : "bg-[#141414] text-[#C7C7CC] hover:bg-[#141414] hover:text-[#FFBC24] hover:border-[#FFBC24]"
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
                    className="px-2 py-1 text-xs bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90"
                >
                    {totalPages}
                </Button>
            )
        }

        return buttons
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 space-x-0 sm:space-x-2 py-4">
            <div className="flex-1 text-sm text-[#C7C7CC]">
                Página {currentPage} de {totalPages}
            </div>
            <div className="flex items-center space-x-1 overflow-x-auto pb-2 max-w-full">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onPrevPage}
                    disabled={currentPage === 1}
                    className="px-2 py-2 bg-[#141414] text-[#C7C7CC] hover:bg-[#141414] hover:text-[#FFBC24] hover:border-[#FFBC24] border-[#3e3e40]"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {renderPaginationButtons()}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                    className="px-2 py-2 bg-[#141414] text-[#C7C7CC] hover:bg-[#141414] hover:text-[#FFBC24] hover:border-[#FFBC24] border-[#3e3e40]"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <div className="w-full sm:w-auto">
                <Select
                    value={booksPerPage.toString()}
                    onValueChange={onBooksPerPageChange}
                >
                    <SelectTrigger className="w-full sm:w-[180px] border-[#3e3e40] bg-[#0e0e0e] text-[#C7C7CC]">
                        <SelectValue placeholder="Filas por página" />
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
        </div>
    )
}

