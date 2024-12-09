import { MoreHorizontal } from 'lucide-react'
import { BookI } from "../../../../types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Button } from "../../../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"

interface BookTableDesktopProps {
    books: BookI[]
    mode: 'crud' | 'reservation'
    onEdit: (book: BookI) => void
    onDelete: (book: BookI) => void
    onReserve: (book: BookI) => void
}

export function BookTableDesktop({ books, mode, onEdit, onDelete, onReserve }: BookTableDesktopProps) {
    return (
        <div className="book-table__desktop">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Páginas</TableHead>
                        <TableHead>Autor</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Subcategoría</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {books.map((book) => (
                        <TableRow key={book.id}>
                            <TableCell>{book.id}</TableCell>
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
                                        <Button variant="ghost" className="book-table__dropdown-trigger">
                                            <span className="sr-only">Abrir menú</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="book-table__dropdown-content">
                                        {mode === 'crud' ? (
                                            <>
                                                <DropdownMenuItem
                                                    onClick={() => onEdit(book)}
                                                    className="book-table__dropdown-item"
                                                >
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onDelete(book)}
                                                    className="book-table__dropdown-item"
                                                >
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <DropdownMenuItem
                                                onClick={() => onReserve(book)}
                                                className="book-table__dropdown-item"
                                            >
                                                Reservar
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

