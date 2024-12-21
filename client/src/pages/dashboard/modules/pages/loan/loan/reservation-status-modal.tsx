import { useState } from 'react'
import { Button } from "../../../../../../components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../../../../../components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../../../components/ui/select"
import { useToast } from '../../../../../../hooks/use-toast'
import { loanApi, UpdateReservationDTO } from '../loan.api'
import { Reservation, ReservationStatus } from '../../../../../../types'

interface ReservationStatusModalProps {
    isOpen: boolean
    onClose: () => void
    reservation: Reservation
    token: string
    onConfirm: () => void
}

export function ReservationStatusModal({
    isOpen,
    onClose,
    reservation,
    token,
    onConfirm,
}: ReservationStatusModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [newStatus, setNewStatus] = useState<ReservationStatus>(reservation.status)
    const { toast } = useToast()

    const handleConfirm = async () => {
        setIsLoading(true)
        try {
            const updateReservationData: UpdateReservationDTO = {
                dueDate: reservation.dueDate,
                status: newStatus,
                copies: reservation.copies.map(copy => copy.id)
            }
            await loanApi.updateReservation(reservation.id, updateReservationData, token)

            toast({
                title: "Estado actualizado",
                description: `El estado de la reserva ha sido actualizado a ${newStatus}.`,
            })
            onConfirm()
            onClose()
        } catch (error) {
            console.error('Error updating reservation status:', error)
            toast({
                title: "Error",
                description: "Hubo un problema al actualizar el estado de la reserva. Por favor, inténtalo de nuevo.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="loan-modal__content">
                <DialogHeader>
                    <DialogTitle className="loan-modal__title">Cambiar estado de la reserva</DialogTitle>
                    <DialogDescription className="loan-modal__description">
                        Selecciona el nuevo estado para esta reserva.
                    </DialogDescription>
                </DialogHeader>
                <div className="loan-modal__grid py-4">
                    <Select onValueChange={(value) => setNewStatus(value as ReservationStatus)} defaultValue={reservation.status}>
                        <SelectTrigger className="loan-modal__select-trigger">
                            <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent className="loan-modal__select-content">
                            {Object.values(ReservationStatus).map((status) => (
                                <SelectItem key={status} value={status} className="loan-modal__select-item">
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading} className="loan-modal__footer-button--cancel">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirm} disabled={isLoading || newStatus === reservation.status} className="loan-modal__footer-button--confirm">
                        {isLoading ? "Actualizando..." : "Confirmar cambio"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
