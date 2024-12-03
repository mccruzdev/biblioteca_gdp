import { useState } from "react";
import {
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { BookI } from "../../../../../../types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../../../../components/ui/table";
import { Button } from "../../../../../../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../../../../components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../../../components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../../../../components/ui/dialog"


interface BookTableProps {
    books: BookI[];
}

export function BookTableCrud({ books }: BookTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [booksPerPage, setBooksPerPage] = useState(10)
    const [selectedBook, setSelectedBook] = useState<BookI | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    const totalPages = Math.ceil(books.length / booksPerPage);

    const nextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleEdit = (book: BookI) => {
        setSelectedBook(book)
        setIsEditModalOpen(true)
    }

    const handleDelete = (book: BookI) => {
        setSelectedBook(book)
        setIsDeleteModalOpen(true)
    }

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxButtons = 7; // Número máximo de botones a mostrar
        let startPage, endPage;

        if (totalPages <= maxButtons) {
            // Mostrar todos los botones si hay menos páginas que el máximo
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage <= Math.ceil(maxButtons / 2)) {
            // Cerca del inicio
            startPage = 1;
            endPage = maxButtons - 2;
        } else if (currentPage >= totalPages - Math.floor(maxButtons / 2)) {
            // Cerca del final
            startPage = totalPages - maxButtons + 3;
            endPage = totalPages;
        } else {
            // En el medio
            startPage = currentPage - Math.floor((maxButtons - 4) / 2);
            endPage = currentPage + Math.ceil((maxButtons - 4) / 2);
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
        );

        // Añadir elipsis si es necesario
        if (startPage > 2) {
            buttons.push(
                <span key="start-ellipsis" className="px-2 py-2">
                    ...
                </span>
            );
        }

        // Añadir páginas intermedias
        for (
            let i = Math.max(2, startPage);
            i <= Math.min(endPage, totalPages - 1);
            i++
        ) {
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
            );
        }

        // Añadir elipsis si es necesario
        if (endPage < totalPages - 1) {
            buttons.push(
                <span key="end-ellipsis" className="px-2 py-2">
                    ...
                </span>
            );
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
            );
        }

        return buttons;
    };

    return (
        <>
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
                                        <DropdownMenuItem onClick={() => handleEdit(book)} className="cursor-pointer">
                                            editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(book)} className="cursor-pointer">
                                            eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between space-x-2 py-4">
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
                        setBooksPerPage(Number(value));
                        setCurrentPage(1);
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
            
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Libro</DialogTitle>
                        <DialogDescription>
                            {/* Aquí puedes añadir el formulario de edición */

                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                        <Button onClick={() => {/* lógica para guardar cambios */}}>Guardar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Eliminar Libro</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar este libro?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
                        <Button onClick={() => {/* lógica para eliminar el libro */}}>Eliminar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
        </>
    );
}
