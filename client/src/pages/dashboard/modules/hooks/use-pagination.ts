import { useState, useMemo } from 'react'

export function usePagination<T>(items: T[], itemsPerPage: number) {
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(items.length / itemsPerPage)

    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage
        const indexOfFirstItem = indexOfLastItem - itemsPerPage
        return items.slice(indexOfFirstItem, indexOfLastItem)
    }, [items, currentPage, itemsPerPage])

    const nextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }

    const prevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }

    const goToPage = (page: number) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages))
        setCurrentPage(pageNumber)
    }

    return {
        currentPage,
        totalPages,
        currentItems,
        nextPage,
        prevPage,
        goToPage,
    }
}

