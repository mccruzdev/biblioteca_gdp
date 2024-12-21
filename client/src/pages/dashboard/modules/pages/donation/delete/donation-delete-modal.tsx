import { Button } from "../../../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../../../components/ui/dialog"

interface DeleteDonationsModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

export function DeleteDonationsModal ({ isOpen, onClose, onConfirm }: DeleteDonationsModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="delete-book-modal__content">
                <DialogHeader>
                    <DialogTitle>Eliminar Donación</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que deseas eliminar la donación?
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