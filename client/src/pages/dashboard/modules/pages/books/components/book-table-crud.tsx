import { useState } from "react"
import { useForm } from "react-hook-form"
import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { BookI } from "../../../../../../types"
//import { format } from "date-fns"
//import { es } from 'date-fns/locale'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../../components/ui/table"
import { Button } from "../../../../../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../../../components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select"
import { useToast } from "../../../../../../hooks/use-toast"
//import { ToastAction } from "../../../../../../components/ui/toast"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card"
//import { usePagination } from "../../catalog/hooks/use-pagination"
import { usePagination } from "../../../hooks/use-pagination"
//import { catalogApi, Copy, CreateReservationDTO } from "../catalog.api"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../../../components/ui/dialog"
import { booksApi } from "../books.api"
import { Label } from "../../../../../../components/ui/label"
import { Input } from "../../../../../../components/ui/input"


interface BookTableProps {
    books: BookI[]
    token: string
}

export function BookTableCrud({ books, token }: BookTableProps) {
    const [booksPerPage, setBooksPerPage] = useState(10)
    const [selectedBook, setSelectedBook] = useState<BookI | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm()
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
        reset({
            title: book.title,
            pages: book.pages,
            author: book.authors[0]?.name || "",
            category: book.category,
            subcategory: book.subcategory,
        })
        setIsEditModalOpen(true)
    }

    const handleDelete = (book: BookI) => {
        setSelectedBook(book)
        setIsDeleteModalOpen(true)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                <Button onClick={() => handleEdit(book)} className="mt-2 bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90">
                    Editar
                </Button>
                <Button onClick={() => handleDelete(book)} className="mt-2 bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90">
                    Eliminar
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
                                                onClick={() => handleEdit(book)}
                                                className="cursor-pointer bg-[#FFBC24] text-[#010101] hover:opacity-70 focus:bg-[#FFBC24] focus:text-[#010101] mb-1"
                                            >
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(book)}
                                                className="cursor-pointer bg-[#FFBC24] text-[#010101] hover:opacity-70 focus:bg-[#FFBC24] focus:text-[#010101] mb-1"
                                            >
                                                Eliminar
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

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#0e0e0e] text-[#C7C7CC]">
                    <DialogHeader>
                        <DialogTitle>Editar Libro</DialogTitle>
                        <DialogDescription>
                            Modifica los detalles del libro y guarda los cambios.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleEditSubmit)}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                    Título
                                </Label>
                                <Input
                                    id="title"
                                    className="col-span-3"
                                    {...register("title", { required: true })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="pages" className="text-right">
                                    Páginas
                                </Label>
                                <Input
                                    id="pages"
                                    type="number"
                                    className="col-span-3"
                                    {...register("pages", { required: true, valueAsNumber: true })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="author" className="text-right">
                                    Autor
                                </Label>
                                <Input
                                    id="author"
                                    className="col-span-3"
                                    {...register("author", { required: true })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">
                                    Categoría
                                </Label>
                                <Input
                                    id="category"
                                    className="col-span-3"
                                    {...register("category", { required: true })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="subcategory" className="text-right">
                                    Subcategoría
                                </Label>
                                <Input
                                    id="subcategory"
                                    className="col-span-3"
                                    {...register("subcategory", { required: true })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">Guardar cambios</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#0e0e0e] text-[#C7C7CC]">
                    <DialogHeader>
                        <DialogTitle>Eliminar Libro</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar este libro?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsDeleteModalOpen(false)} variant="secondary">Cancelar</Button>
                        <Button onClick={handleDeleteConfirm} variant="destructive">Eliminar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}


