import { useState } from 'react'
import { Button } from "../../../../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog"
import { useToast } from '../../../../../../hooks/use-toast'
import { loanApi, CreateLoanDTO, UpdateReservationDTO } from '../loan.api'
import { Reservation, ReservationStatus, LoanStatus } from '../../../../../../types'

interface LoanConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  reservation: Reservation
  token: string
  onConfirm: () => void
  bookTitle?: string
}

export function LoanConfirmationModal({
  isOpen,
  onClose,
  reservation,
  token,
  onConfirm,
  bookTitle
}: LoanConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14) // Set due date to 14 days from now

      // Update reservation status
      const updateReservationData: UpdateReservationDTO = {
        dueDate: reservation.dueDate,
        status: ReservationStatus.PICKED_UP,
        copies: reservation.copies.map(copy => copy.id)
      }
      await loanApi.updateReservation(reservation.id, updateReservationData, token)

      // Create loan
      const loanData: CreateLoanDTO = {
        dueDate: dueDate.toISOString(),
        status: LoanStatus.ACTIVE,
        copies: reservation.copies.map(copy => copy.id)
      }
      await loanApi.createLoan(loanData, token)

      toast({
        title: "Préstamo creado",
        description: "La reserva ha sido convertida a préstamo exitosamente.",
      })
      onConfirm()
      onClose()
    } catch (error) {
      console.error('Error creating loan:', error)
      toast({
        title: "Error",
        description: "Hubo un problema al crear el préstamo. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar conversión a préstamo</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas convertir esta reserva en un préstamo?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500">Detalles del préstamo:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li className="text-sm">Libro: <span className="font-medium">{bookTitle || 'Título no disponible'}</span></li>
            <li className="text-sm">Duración del préstamo: <span className="font-medium">14 días</span></li>
            <li className="text-sm">Fecha de vencimiento: <span className="font-medium">{new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString('es-ES')}</span></li>
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Procesando..." : "Confirmar préstamo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

