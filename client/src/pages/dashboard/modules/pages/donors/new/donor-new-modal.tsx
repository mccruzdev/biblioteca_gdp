import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import { useForm, FieldValues } from "react-hook-form";
import { Button } from "../../../../../../components/ui/button";
import { useTokenUC } from "../../../../../../context/user/user.hook";
import { donorsApi } from "../donors.api";
import { useToast } from "../../../../../../hooks/use-toast";
import { ToastAction } from "../../../../../../components/ui/toast";

interface DonorFormProps {
    onSuccess?: () => void;
}

export function DonorForm ({ onSuccess }: DonorFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>();
    const { data: token } = useTokenUC();
    const { toast } = useToast();

    const onSubmit = handleSubmit(async (data) => {
        if (!token) return;

        const DonorData = {
            name: data.name,
            email:data.email
        };

        try {
            const response = await donorsApi.createDonor(DonorData, token);
            console.log('Respuesta:', response); // Para debug

            toast({
                title: "Éxito",
                description: `El donador "${data.name}" ha sido creado`,
                action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
            });

            onSuccess?.(); // Llamamos a onSuccess si existe
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error instanceof Error ? error.message : "Error al crear el donador",
                variant: "destructive",
            });
        }
    });

    return (
        <form onSubmit={onSubmit} className="book-form__container">
            <div>
                <Label htmlFor="name" className="book-form__label">Nombre</Label>
                <Input
                    id="name"
                    {...register("name", { required: "El nombre es requerido" })}
                    className="book-form__input"
                />
                {errors.title && (
                    <p className="book-form__error">{errors.title.message as string}</p>
                )}
            </div>

            <div>
                <Label htmlFor="email" className="book-form__label">Email</Label>
                <Input
                    id="email"
                    {...register("email", { required: "El correo es requerido" })}
                    className="book-form__input"
                />
                {errors.title && (
                    <p className="book-form__error">{errors.title.message as string}</p>
                )}
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

