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
import { useToast } from "../../../../../../hooks/use-toast"
import { loanApi, CreateLoanDTO } from '../loan.api'

interface LoanConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    reservation: {
        id: number
        bookId?: number
        bookTitle?: string
        dueDate: string
        copies: { id: number }[]
    }
    token: string
    onSuccess: () => void
}

export function LoanConfirmationModal({
    isOpen,
    onClose,
    reservation,
    token,
    onSuccess
}: LoanConfirmationModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleConfirm = async () => {
        setIsLoading(true)
        try {
            const loanData: CreateLoanDTO = {
                dueDate: reservation.dueDate,
                status: 'ACTIVE',
                copies: [reservation.copies[0].id]
            };

            console.log('Loan data:', loanData);

            const result = await loanApi.createLoan(loanData, token);
            console.log('Create loan result:', result);

            toast({
                title: "Préstamo registrado",
                description: `El préstamo para el libro "${reservation.bookTitle}" ha sido registrado exitosamente.`,
            })
            onSuccess()
        } catch (error) {
            console.error('Error registering loan:', error)
            toast({
                title: "Error",
                description: "Hubo un problema al registrar el préstamo. Por favor, inténtelo de nuevo.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar Préstamo</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro que desea registrar el préstamo para el libro "{reservation.bookTitle}" (ID: {reservation.bookId})?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? "Procesando..." : "Confirmar Préstamo"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}