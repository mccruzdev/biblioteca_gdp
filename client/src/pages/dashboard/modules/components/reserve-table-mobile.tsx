import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Copy } from "../pages/loan/loan.api";

interface Reservation {
    id: number;
    created: string;
    dueDate: string;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    copies: Copy[];
    bookTitle?: string;
    bookId?: number;
}

interface ReservationTableMobileProps {
    reservations: Reservation[];
    onLoan: (reservation: Reservation) => void;
}

export function ReservationTableMobile({ reservations, onLoan }: ReservationTableMobileProps) {
    return (
        <div className="reservation-table__mobile">
            {reservations.map((reservation) => (
                <Card key={reservation.id} className="reservation-table__card mb-4">
                    <CardHeader>
                        <CardTitle>Reserva #{reservation.id}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>ID Libro:</strong> {reservation.bookId || 'N/A'}</p>
                        <p><strong>Libro:</strong> {reservation.bookTitle || 'Cargando...'}</p>
                        <p><strong>Fecha de Creación:</strong> {new Date(reservation.created).toLocaleString()}</p>
                        <p><strong>Fecha de Reserva:</strong> {new Date(reservation.dueDate).toLocaleString()}</p>
                        <p><strong>Estado:</strong> {reservation.status}</p>
                        <p><strong>Copia:</strong> {reservation.copies[0]?.code || 'N/A'}</p>
                        <Button
                            onClick={() => onLoan(reservation)}
                            className="reservation-table__button mt-2"
                        >
                            Préstamo
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

