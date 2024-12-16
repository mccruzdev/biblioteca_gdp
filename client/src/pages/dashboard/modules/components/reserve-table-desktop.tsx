import { MoreHorizontal } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Reservation {
    id: string;
    bookTitle: string;
    copyCode: string;
    createdAt: string;
    reservationDate: string;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

interface ReservationTableDesktopProps {
    reservations: Reservation[];
    onCancel: (reservation: Reservation) => void;
}

export function ReservationTableDesktop({ reservations, onCancel }: ReservationTableDesktopProps) {
    return (
        <div className="reservation-table__desktop">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID Reserva</TableHead>
                        <TableHead>Libro</TableHead>
                        <TableHead>Copia</TableHead>
                        <TableHead>Fecha de Creación</TableHead>
                        <TableHead>Fecha de Reserva</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                            <TableCell>{reservation.id}</TableCell>
                            <TableCell>{reservation.bookTitle}</TableCell>
                            <TableCell>{reservation.copyCode}</TableCell>
                            <TableCell>{reservation.createdAt}</TableCell>
                            <TableCell>{reservation.reservationDate}</TableCell>
                            <TableCell>{reservation.status}</TableCell>
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
                                            onClick={() => onCancel(reservation)}
                                            className="reservation-table__dropdown-item"
                                        >
                                            Cancelar Reserva
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

