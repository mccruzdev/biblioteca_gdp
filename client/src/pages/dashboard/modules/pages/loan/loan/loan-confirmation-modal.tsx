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
import { Label } from "../../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select"
import { format, setHours, setMinutes, addMinutes } from 'date-fns'

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
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const { toast } = useToast()

  const generateTimeOptions = () => {
    const now = new Date()
    const options = []
    const endTime = setHours(setMinutes(now, 0), 17)

    let currentTime = now
    currentTime = setMinutes(currentTime, Math.ceil(currentTime.getMinutes() / 30) * 30)

    while (currentTime <= endTime) {
      options.push(format(currentTime, 'HH:mm'))
      currentTime = addMinutes(currentTime, 30)
    }

    return options
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      if (!selectedTime) {
        throw new Error("Por favor, selecciona una hora para el préstamo.")
      }

      const [hours, minutes] = selectedTime.split(':').map(Number)
      const dueDate = new Date()
      dueDate.setHours(hours, minutes, 0, 0)

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
        description: error instanceof Error ? error.message : "Hubo un problema al crear el préstamo. Por favor, inténtalo de nuevo.",
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
            <Label htmlFor="loanTime" className="loan-modal__label">Hora de finalización del préstamo:</Label>
            <Select onValueChange={setSelectedTime}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar hora" />
              </SelectTrigger>
              <SelectContent>
                {generateTimeOptions().map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li className="text-sm">Libro: <span className="font-medium">{bookTitle || 'Título no disponible'}</span></li>
            <li className="text-sm">Fecha del préstamo: <span className="font-medium">{new Date().toLocaleDateString('es-ES')}</span></li>
            <li className="text-sm">Hora de finalización: <span className="font-medium">{selectedTime || 'No seleccionada'}</span></li>
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="loan-modal__footer-button--cancel">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || !selectedTime} className="loan-modal__footer-button--confirm">
            {isLoading ? "Procesando..." : "Confirmar préstamo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

