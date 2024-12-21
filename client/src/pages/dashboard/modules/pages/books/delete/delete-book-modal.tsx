
import { Button } from "../../../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../../../components/ui/dialog"

interface DeleteBookModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

export function DeleteBookModal({ isOpen, onClose, onConfirm }: DeleteBookModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="delete-book-modal__content">
                <DialogHeader>
                    <DialogTitle>Eliminar Libro</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que deseas eliminar este libro?
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

