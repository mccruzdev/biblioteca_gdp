import { Button } from "../../../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../../../components/ui/dialog"

interface DeleteDonorModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

export function DeleteDonorModal ({ isOpen, onClose, onConfirm }: DeleteDonorModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="delete-book-modal__content">
                <DialogHeader>
                    <DialogTitle>Eliminar Donador</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que deseas eliminar al Donador?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="delete-book-modal__footer">
                    <Button onClick={onClose} variant="secondary">Cancelar</Button>
                    <Button onClick={onConfirm} variant="destructive">Eliminar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}