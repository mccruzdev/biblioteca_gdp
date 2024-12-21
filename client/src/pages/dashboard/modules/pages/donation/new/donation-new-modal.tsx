import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import { useForm, FieldValues } from "react-hook-form";
import { Button } from "../../../../../../components/ui/button";
import { useTokenUC } from "../../../../../../context/user/user.hook";
import { donationsApi } from "../donations.api";
import { useToast } from "../../../../../../hooks/use-toast";
import { ToastAction } from "../../../../../../components/ui/toast";

interface DonationFormProps {
    onSuccess?: () => void;
}

export interface DonationDTO {
    donorId: string;
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

export function DonationForm ({ onSuccess }: DonationFormProps) {
    const {
        register,
        handleSubmit,
        //formState: { errors },
    } = useForm<FieldValues>();
    const { data: token } = useTokenUC();
    const { toast } = useToast();

    const onSubmit = handleSubmit(async (data) => {
        if (!token) return;

        const DonationData : DonationDTO = data as DonationDTO

        try {
            const response = await donationsApi.createDonation(DonationData, token);
            console.log('Respuesta:', response); // Para debug

            toast({
                title: "Éxito",
                description: `La donación "${DonationData.description}" ha sido creada`,
                action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
            });

            onSuccess?.(); // Llamamos a onSuccess si existe
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error instanceof Error ? error.message : "Error al crear la donación",
                variant: "destructive",
            });
        }
    });

    return (
        <form onSubmit={onSubmit} className="book-form__container">
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

            <div className="pt-3">
                <Button
                    type="submit"
                    className="book-form__submit"
                >
                    Guardar
                </Button>
            </div>
        </form>
    );
}

