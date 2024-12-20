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
import { Input } from "../../../../../../components/ui/input"
import { Label } from "../../../../../../components/ui/label"

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
  const [loanDuration, setLoanDuration] = useState(14)
  const { toast } = useToast()

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + loanDuration) 

      const updateReservationData: UpdateReservationDTO = {
        dueDate: dueDate.toISOString(),
        status: ReservationStatus.PICKED_UP,
        copies: reservation.copies.map(copy => copy.id)
      }
      await loanApi.updateReservation(reservation.id, updateReservationData, token)

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
      <DialogContent className="loan-modal__content">
        <DialogHeader>
          <DialogTitle className="loan-modal__title">Confirmar conversión a préstamo</DialogTitle>
          <DialogDescription className="loan-modal__description">
            ¿Estás seguro de que deseas convertir esta reserva en un préstamo?
          </DialogDescription>
        </DialogHeader>
        <div className="loan-modal__grid">
          <p className="text-sm text-gray-500 mb-2">Detalles del préstamo:</p>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="loanDuration" className="loan-modal__label">Duración del préstamo (días):</Label>
            <Input
              id="loanDuration"
              type="number"
              min="1"
              value={loanDuration}
              onChange={(e) => setLoanDuration(parseInt(e.target.value) || 14)}
              className="loan-modal__input w-20"
            />
          </div>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li className="text-sm">Libro: <span className="font-medium">{bookTitle || 'Título no disponible'}</span></li>
            <li className="text-sm">Fecha de vencimiento: <span className="font-medium">{new Date(new Date().setDate(new Date().getDate() + loanDuration)).toLocaleDateString('es-ES')}</span></li>
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="loan-modal__footer-button--cancel">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading} className="loan-modal__footer-button--confirm">
            {isLoading ? "Procesando..." : "Confirmar préstamo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

