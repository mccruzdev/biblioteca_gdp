
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
            <DialogContent className="sm:max-w-[425px] bg-[#0e0e0e] text-[#C7C7CC]">
                <DialogHeader>
                    <DialogTitle>Eliminar Libro</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que deseas eliminar este libro?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onClose} variant="secondary">Cancelar</Button>
                    <Button onClick={onConfirm} variant="destructive">Eliminar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

