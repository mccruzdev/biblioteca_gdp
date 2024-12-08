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
                    {books.map((book) => (
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
                                        {mode === 'crud' ? (
                                            <>
                                                <DropdownMenuItem
                                                    onClick={() => onEdit(book)}
                                                    className="cursor-pointer bg-[#FFBC24] text-[#010101] hover:opacity-70 focus:bg-[#FFBC24] focus:text-[#010101] mb-1"
                                                >
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onDelete(book)}
                                                    className="cursor-pointer bg-[#FFBC24] text-[#010101] hover:opacity-70 focus:bg-[#FFBC24] focus:text-[#010101] mb-1"
                                                >
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <DropdownMenuItem
                                                onClick={() => onReserve(book)}
                                                className="cursor-pointer bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90 focus:bg-[#FFBC24] focus:text-[#010101]"
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

