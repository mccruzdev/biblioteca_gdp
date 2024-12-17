import { MoreHorizontal } from 'lucide-react'
import { BookI } from "../../../../types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Button } from "../../../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Copy } from '../pages/loan/loan.api'

interface Reservation {
    id: number;
    created: string;
    dueDate: string;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    copies: Copy[];
    bookTitle?: string;
    bookId?: number;
}

type Item = BookI | Reservation;

interface ItemTableDesktopProps {
    items: Item[];
    mode: 'books' | 'reservations';
    viewMode: 'books' | 'catalog' | 'loan';
    onEdit?: (item: BookI) => void;
    onDelete?: (item: BookI) => void;
    onReserve?: (item: BookI) => void;
    onLoan: (item: Item) => void;
}

export function ItemTableDesktop({ items, mode, viewMode, onEdit, onDelete, onReserve, onLoan }: ItemTableDesktopProps) {
    const isBook = (item: Item): item is BookI => 'title' in item;

    return (
        <div className={`${mode}-table__desktop`}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        {mode === 'books' ? (
                            <>
                                <TableHead>Título</TableHead>
                                <TableHead>Páginas</TableHead>
                                <TableHead>Autor</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Subcategoría</TableHead>
                            </>
                        ) : (
                            <>
                                <TableHead>ID Libro</TableHead>
                                <TableHead>Libro</TableHead>
                                <TableHead>Fecha de Creación</TableHead>
                                <TableHead>Fecha de Reserva</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Copia</TableHead>
                            </>
                        )}
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            {isBook(item) ? (
                                <>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>{item.pages}</TableCell>
                                    <TableCell>
                                        {item.authors[0] ? item.authors[0].name : "Desconocido"}
                                    </TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.subcategory}</TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell>{item.bookId || 'N/A'}</TableCell>
                                    <TableCell>{item.bookTitle || 'Cargando...'}</TableCell>
                                    <TableCell>{new Date(item.created).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(item.dueDate).toLocaleString()}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>{item.copies[0]?.code || 'N/A'}</TableCell>
                                </>
                            )}
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className={`${mode}-table__dropdown-trigger`}>
                                            <span className="sr-only">Abrir menú</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className={`${mode}-table__dropdown-content`}>
                                        {viewMode === 'books' && isBook(item) && (
                                            <>
                                                {onEdit && (
                                                    <DropdownMenuItem
                                                        onClick={() => onEdit(item)}
                                                        className={`${mode}-table__dropdown-item mb-1`}
                                                    >
                                                        Editar
                                                    </DropdownMenuItem>
                                                )}
                                                {onDelete && (
                                                    <DropdownMenuItem
                                                        onClick={() => onDelete(item)}
                                                        className={`${mode}-table__dropdown-item mb-1`}
                                                    >
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                )}
                                            </>
                                        )}
                                        {viewMode === 'catalog' && isBook(item) && onReserve && (
                                            <DropdownMenuItem
                                                onClick={() => onReserve(item)}
                                                className={`${mode}-table__dropdown-item`}
                                            >
                                                Reservar
                                            </DropdownMenuItem>
                                        )}
                                        {viewMode === 'loan' && (
                                            <DropdownMenuItem
                                                onClick={() => onLoan(item)}
                                                className={`${mode}-table__dropdown-item`}
                                            >
                                                {mode === 'books' ? 'Préstamo' : 'Convertir a préstamo'}
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
