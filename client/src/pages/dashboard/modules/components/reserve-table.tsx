import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ReservationTableDesktop } from "./reserve-table-desktop";
import { ReservationTableMobile } from "./reserve-table-mobile";

interface Reservation {
    id: string;
    bookTitle: string;
    copyCode: string;
    createdAt: string;
    reservationDate: string;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

// Example data
const exampleReservations: Reservation[] = [
    {
        id: "1",
        bookTitle: "El Quijote",
        copyCode: "QUI001",
        createdAt: "2023-06-01 10:00",
        reservationDate: "2023-06-15 14:00",
        status: "PENDING"
    },
    {
        id: "2",
        bookTitle: "Cien años de soledad",
        copyCode: "CAS001",
        createdAt: "2023-06-02 11:30",
        reservationDate: "2023-06-16 15:30",
        status: "ACTIVE"
    },
    {
        id: "3",
        bookTitle: "1984",
        copyCode: "ORW001",
        createdAt: "2023-06-03 09:15",
        reservationDate: "2023-06-17 10:00",
        status: "COMPLETED"
    }
];

export function ReservationTable() {
    const [reservations, setReservations] = useState<Reservation[]>(exampleReservations)
    const { toast } = useToast()

    const handleCancelReservation = (reservation: Reservation) => {
        // Here you would typically call an API to cancel the reservation
        // For this example, we'll just update the local state
        const updatedReservations = reservations.map(r =>
            r.id === reservation.id ? { ...r, status: 'CANCELLED' as const } : r
        )
        setReservations(updatedReservations)

        toast({
            title: "Reserva cancelada",
            description: `La reserva para "${reservation.bookTitle}" ha sido cancelada.`,
        })
    }

    return (
        <div className="reservation-table">
            <ReservationTableDesktop
                reservations={reservations}
                onCancel={handleCancelReservation}
            />
            <ReservationTableMobile
                reservations={reservations}
                onCancel={handleCancelReservation}
            />
        </div>
    )
}

