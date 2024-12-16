import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Reservation {
    id: string;
    bookTitle: string;
    copyCode: string;
    createdAt: string;
    reservationDate: string;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

interface ReservationTableMobileProps {
    reservations: Reservation[];
    onCancel: (reservation: Reservation) => void;
}

export function ReservationTableMobile({ reservations, onCancel }: ReservationTableMobileProps) {
    return (
        <div className="reservation-table__mobile">
            {reservations.map((reservation) => (
                <Card key={reservation.id} className="reservation-table__card mb-4">
                    <CardHeader>
                        <CardTitle>{reservation.bookTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>ID Reserva:</strong> {reservation.id}</p>
                        <p><strong>Copia:</strong> {reservation.copyCode}</p>
                        <p><strong>Fecha de Creación:</strong> {reservation.createdAt}</p>
                        <p><strong>Fecha de Reserva:</strong> {reservation.reservationDate}</p>
                        <p><strong>Estado:</strong> {reservation.status}</p>
                        <Button
                            onClick={() => onCancel(reservation)}
                            className="reservation-table__button mt-2"
                        >
                            Cancelar Reserva
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

