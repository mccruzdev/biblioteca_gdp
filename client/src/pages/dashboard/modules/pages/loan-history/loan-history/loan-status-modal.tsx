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
import { loanHistoryApi, UpdateLoanDTO } from '../loan-history.api'
import { Loan, LoanStatus } from '../../../../../../types'

interface LoanStatusModalProps {
    isOpen: boolean
    onClose: () => void
    loan: Loan
    token: string
    onConfirm: () => void
}

export function LoanStatusModal({
    isOpen,
    onClose,
    loan,
    token,
    onConfirm,
}: LoanStatusModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [newStatus, setNewStatus] = useState<LoanStatus>(loan.status)
    const { toast } = useToast()

    const handleConfirm = async () => {
        setIsLoading(true)
        try {
            const updateLoanData: UpdateLoanDTO = {
                dueDate: loan.dueDate,
                status: newStatus,
                copies: loan.copies.map(copy => copy.id)
            }
            await loanHistoryApi.updateLoan(loan.id, updateLoanData, token)

            toast({
                title: "Estado actualizado",
                description: `El estado del préstamo ha sido actualizado a ${newStatus}.`,
            })
            onConfirm()
            onClose()
        } catch (error) {
            console.error('Error updating loan status:', error)
            toast({
                title: "Error",
                description: "Hubo un problema al actualizar el estado del préstamo. Por favor, inténtalo de nuevo.",
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
                    <DialogTitle className="loan-modal__title">Cambiar estado del préstamo</DialogTitle>
                    <DialogDescription className="loan-modal__description">
                        Selecciona el nuevo estado para este préstamo.
                    </DialogDescription>
                </DialogHeader>
                <div className="loan-modal__grid py-4">
                    <Select onValueChange={(value) => setNewStatus(value as LoanStatus)} defaultValue={loan.status}>
                        <SelectTrigger className="loan-modal__select-trigger">
                            <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent className="loan-modal__select-content">
                            {Object.values(LoanStatus).map((status) => (
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
                    <Button onClick={handleConfirm} disabled={isLoading || newStatus === loan.status} className="loan-modal__footer-button--confirm">
                        {isLoading ? "Actualizando..." : "Confirmar cambio"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

