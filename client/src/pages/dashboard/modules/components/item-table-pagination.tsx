import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "../../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"

interface ItemTablePaginationProps {
    currentPage: number
    totalPages: number
    itemsPerPage: number
    onPageChange: (page: number) => void
    onItemsPerPageChange: (value: number) => void
    prevPageUrl: string | null
    nextPageUrl: string | null
}

export function ItemTablePagination({
    currentPage,
    totalPages,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    prevPageUrl,
    nextPageUrl
}: ItemTablePaginationProps) {

    const renderPaginationButtons = () => {
        const buttons = []
        const maxButtons = 5
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
        let endPage = Math.min(totalPages, startPage + maxButtons - 1)

        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    key={i}
                    variant={i === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(i)}
                    className={`item-table__pagination-button ${i === currentPage
                        ? `item-table__pagination-button--active`
                        : `item-table__pagination-button--inactive`
                        }`}
                >
                    {i}
                </Button>
            )
        }

        return buttons
    }

    return (
        <div className="item-table__pagination">
            <div className="item-table__pagination-info">
                Página {currentPage} de {totalPages}
            </div>
            <div className="item-table__pagination-buttons">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => prevPageUrl && onPageChange(currentPage - 1)}
                    disabled={!prevPageUrl}
                    className="item-table__pagination-button item-table__pagination-button--inactive"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {renderPaginationButtons()}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => nextPageUrl && onPageChange(currentPage + 1)}
                    disabled={!nextPageUrl}
                    className="item-table__pagination-button item-table__pagination-button--inactive"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <div className="item-table__pagination-select">
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => onItemsPerPageChange(Number(value))}
                >
                    <SelectTrigger className="item-table__pagination-select-trigger">
                        <SelectValue placeholder="Filas por página" />
                    </SelectTrigger>
                    <SelectContent className="item-table__pagination-select-content">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={pageSize.toString()} className="item-table__pagination-select-item">
                                Mostrar {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

