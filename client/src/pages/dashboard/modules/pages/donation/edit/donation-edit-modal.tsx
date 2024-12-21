import React from "react"
import { useForm } from "react-hook-form"
import { Button } from "../../../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../../../components/ui/dialog"
import { Label } from "../../../../../../components/ui/label"
import { Input } from "../../../../../../components/ui/input"

interface EditDonationsModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
    donation: DonationDTO | null
}

export interface DonationDTO {
    donorId: number;
    description: string;
    copies: {
        code: string;
        condition: string;
        location: {
            shelf: string;
            shelfColor: string;
            shelfLevel: string;
        },
        publisher: {
            name: string;
            email: string;
            country: string;
            address: string;
            phoneNumber: string;
            website: string;
        },
        bookId: number;
    }
}

export function EditDonationsModal ({ isOpen, onClose, onSubmit, donation}: EditDonationsModalProps) {
    const { register, handleSubmit, reset } = useForm()

    React.useEffect(() => {
        if (donation) {
            reset({
                donorId: donation.donorId,
                description: donation.description,
                copCode: donation.copies.code,
                copCondition: donation.copies.condition,
                locShelf: donation.copies.location.shelf,
                locShelfC: donation.copies.location.shelfColor,
                locShelfL: donation.copies.location.shelfLevel,
                PubName: donation.copies.publisher.name,
                PubEmail: donation.copies.publisher.email,
                PubCountry: donation.copies.publisher.country,
                PubAddress: donation.copies.publisher.address,
                PubPhoneNumber: donation.copies.publisher.phoneNumber,
                PubWebsite: donation.copies.publisher.website,
                bookId:donation.copies.bookId     
            })
        }
    }, [donation, reset])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="edit-book-modal__content">
                <DialogHeader>
                    <DialogTitle>Editar Donacion</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles de la Donacion y guarda los cambios.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="edit-book-modal__form">
                    <div className="edit-book-modal__field">
                        <Label htmlFor="donorId" className="edit-book-modal__label">
                            donorId
                        </Label>
                        <Input
                            id="donorId"
                            className="edit-book-modal__input"
                            {...register("donorId", { required: true })}
                        />
                    </div>
                    <div className="edit-book-modal__field">
                        <Label htmlFor="description" className="edit-book-modal__label">
                            Descripción
                        </Label>
                        <Input
                            id="description"
                            className="edit-book-modal__input"
                            {...register("description", { required: true })}
                        />
                    </div>
                    <div className="edit-book-modal__field">
                        <Label htmlFor="copCode" className="edit-book-modal__label">
                            Codigo de la copia
                        </Label>
                        <Input
                            id="copCode"
                            className="edit-book-modal__input"
                            {...register("copCode", { required: true })}
                        />
                    </div>
                    <div className="edit-book-modal__field">
                        <Label htmlFor="copCondition" className="edit-book-modal__label">
                            Condición de la copia
                        </Label>
                        <Input
                            id="copCondition"
                            className="edit-book-modal__input"
                            {...register("copCondition", { required: true })}
                        />
                    </div>
                    <div className="edit-book-modal__field">
                        <Label htmlFor="locShelf" className="edit-book-modal__label">
                            Estante
                        </Label>
                        <Input
                            id="locShelf"
                            className="edit-book-modal__input"
                            {...register("locShelf", { required: true })}
                        />
                    </div>
                    <div className="edit-book-modal__field">
                        <Label htmlFor="locShelfC" className="edit-book-modal__label">
                            Color del estante
                        </Label>
                        <Input
                            id="locShelfC"
                            className="edit-book-modal__input"
                            {...register("locShelfC", { required: true })}
                        />
                    </div>
                    <div className="edit-book-modal__field">
                        <Label htmlFor="locShelfL" className="edit-book-modal__label">
                            Nivel del estante
                        </Label>
                        <Input
                            id="locShelfL"
                            className="edit-book-modal__input"
                            {...register("locShelfL", { required: true })}
                        />
                    </div>
                    <div className="edit-book-modal__field">
                        <Label htmlFor="PubName" className="edit-book-modal__label">
                            Nombre del publicante
                        </Label>
                        <Input
                            id="PubName"
                            className="edit-book-modal__input"
                            {...register("PubName", { required: true })}
                        />
                    </div>
                    <div className="edit-book-modal__field">
                        <Label htmlFor="PubEmail" className="edit-book-modal__label">
                            Correo del publicante
                        </Label>
                        <Input
                            id="PubEmail"
                            className="edit-book-modal__input"
                            {...register("PubEmail", { required: true })}
                        />
                    </div>
                    <div className="edit-book-modal__field">
                        <Label htmlFor="PubCountry" className="edit-book-modal__label">
                            País del publicante
                        </Label>
                        <Input
                            id="PubCountry"
                            className="edit-book-modal__input"
                            {...register("PubCountry", { required: true })}
                        />
                    </div>
                    <div className="edit-book-modal__field">
                        <Label htmlFor="PubAddress" className="edit-book-modal__label">
                            Dirección del publicante
                        </Label>
                        <Input
                            id="PubAddress"
                            className="edit-book-modal__input"
                            {...register("PubAddress", { required: true })}
                        />
                    </div>
                    <div className="edit-book-modal__field">
                        <Label htmlFor="PubPhoneNumber" className="edit-book-modal__label">
                            Número de télefono del publicante
                        </Label>
                        <Input
                            id="PubPhoneNumber"
                            className="edit-book-modal__input"
                            {...register("PubPhoneNumber", { required: true })}
                        />
                    </div>
                    <div className="edit-book-modal__field">
                        <Label htmlFor="PubWebsite" className="edit-book-modal__label">
                            Pagina Web del publicante
                        </Label>
                        <Input
                            id="PubWebsite"
                            className="edit-book-modal__input"
                            {...register("PubWebsite", { required: true })}
                        />
                    </div>
                    <div className="edit-book-modal__field">
                        <Label htmlFor="bookId" className="edit-book-modal__label">
                            Id del libro
                        </Label>
                        <Input
                            id="bookId"
                            className="edit-book-modal__input"
                            {...register("bookId", { required: true })}
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

