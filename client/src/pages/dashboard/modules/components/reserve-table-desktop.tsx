import { MoreHorizontal } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Button } from "../../../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Copy } from '../pages/loan/loan.api';

interface Reservation {
    id: number;
    created: string;
    dueDate: string;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    copies: Copy[];
    bookTitle?: string;
    bookId?: number;
}

interface ReservationTableDesktopProps {
    reservations: Reservation[];
    onLoan: (reservation: Reservation) => void;
}

export function ReservationTableDesktop({ reservations, onLoan }: ReservationTableDesktopProps) {
    return (
        <div className="reservation-table__desktop">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID Reserva</TableHead>
                        <TableHead>ID Libro</TableHead>
                        <TableHead>Libro</TableHead>
                        <TableHead>Fecha de Creación</TableHead>
                        <TableHead>Fecha de Reserva</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Copia</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                            <TableCell>{reservation.id}</TableCell>
                            <TableCell>{reservation.bookId || 'N/A'}</TableCell>
                            <TableCell>{reservation.bookTitle || 'Cargando...'}</TableCell>
                            <TableCell>{new Date(reservation.created).toLocaleString()}</TableCell>
                            <TableCell>{new Date(reservation.dueDate).toLocaleString()}</TableCell>
                            <TableCell>{reservation.status}</TableCell>
                            <TableCell>{reservation.copies[0]?.code || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="reservation-table__dropdown-trigger">
                                            <span className="sr-only">Abrir menú</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="reservation-table__dropdown-content">
                                        <DropdownMenuItem
                                            onClick={() => onLoan(reservation)}
                                            className="reservation-table__dropdown-item"
                                        >
                                            Préstamo
                                        </DropdownMenuItem>
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

