import React from "react"
import { useForm } from "react-hook-form"
import { DonorsI } from "../../../../../../types"
import { Button } from "../../../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../../../components/ui/dialog"
import { Label } from "../../../../../../components/ui/label"
import { Input } from "../../../../../../components/ui/input"

interface EditDonorModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
    donor: DonorsI | null
}

export function EditDonorModal ({ isOpen, onClose, onSubmit, donor }: EditDonorModalProps) {
    const { register, handleSubmit, reset } = useForm()

    React.useEffect(() => {
        if (donor) {
            reset({
                name: donor.name,
                email: donor.email
                
            })
        }
    }, [donor, reset])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="edit-book-modal__content">
                <DialogHeader>
                    <DialogTitle>Editar Donador</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles del Donador y guarda los cambios.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="edit-book-modal__form">
                    <div className="edit-book-modal__field">
                        <Label htmlFor="title" className="edit-book-modal__label">
                            Nombre
                        </Label>
                        <Input
                            id="name"
                            className="edit-book-modal__input"
                            {...register("name", { required: true })}
                        />
                    </div>
                    <div className="edit-book-modal__field">
                        <Label htmlFor="author" className="edit-book-modal__label">
                            Email
                        </Label>
                        <Input
                            id="email"
                            className="edit-book-modal__input"
                            {...register("email", { required: true })}
                        />
                    </div>
                    <DialogFooter className="edit-book-modal__footer">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="edit-book-modal__button edit-book-modal__button--cancel"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="edit-book-modal__button edit-book-modal__button--save"
                        >
                            Guardar cambios
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

