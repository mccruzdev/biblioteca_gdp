"use client";
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import { useForm, FieldValues } from "react-hook-form";
import { Button } from "../../../../../../components/ui/button";
import { useToast } from "../../../../../../hooks/use-toast";
import { ToastAction } from "../../../../../../components/ui/toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../../../components/ui/select";
import { booksApi, CopyDto, BookCondition } from "../books.api";
import { useTokenUC } from "../../../../../../context/user/user.hook";

interface CopyFormProps {
    onSuccess?: () => void;
}

export function CopyForm({ onSuccess }: CopyFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<FieldValues>();
    const { toast } = useToast();
    const { data: token } = useTokenUC();

    const onSubmit = handleSubmit(async (data) => {
        if (!token) {
            toast({
                title: "Error",
                description: "No se pudo autenticar. Por favor, inicie sesión nuevamente.",
                variant: "destructive",
            });
            return;
        }

        const copyData: CopyDto = {
            code: data.code,
            condition: data.condition as BookCondition,
            location: {
                shelf: data.shelf,
                shelfColor: data.shelfColor,
                shelfLevel: data.shelfLevel,
            },
            publisher: {
                name: data.publisherName,
                email: data.publisherEmail,
                country: data.publisherCountry,
                address: data.publisherAddress,
                phoneNumber: data.publisherPhone,
                website: data.publisherWebsite,
            },
            bookId: parseInt(data.bookId, 10),
        };

        try {
            const result = await booksApi.createCopy(copyData, token);

            toast({
                title: "Éxito",
                description: result.message || `La copia del libro con ID ${copyData.bookId} ha sido creada`,
                action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
            });

            onSuccess?.();
        } catch (error) {
            console.error('Error creating copy:', error);
            toast({
                title: "Error",
                description: "Hubo un problema al crear la copia. Por favor, inténtalo de nuevo.",
                variant: "destructive",
            });
        }
    });

    return (
        <div className="book-form__scrollable-container">
            <form onSubmit={onSubmit} className="book-form__container">
                <div className="book-form__field">
                    <Label htmlFor="code" className="book-form__label">Código de la Copia</Label>
                    <Input
                        id="code"
                        {...register("code", { required: "El código de la copia es requerido" })}
                        className="book-form__input"
                    />
                    {errors.code && (
                        <p className="book-form__error">{errors.code.message as string}</p>
                    )}
                </div>
                <div className="book-form__field">
                    <Label htmlFor="condition" className="book-form__label">Condición</Label>
                    <Select onValueChange={(value) => setValue("condition", value)}>
                        <SelectTrigger className="book-form__input">
                            <SelectValue placeholder="Selecciona la condición" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={BookCondition.NEW}>Nueva</SelectItem>
                            <SelectItem value={BookCondition.GOOD}>Buena</SelectItem>
                            <SelectItem value={BookCondition.FAIR}>Regular</SelectItem>
                            <SelectItem value={BookCondition.DAMAGED}>Dañada</SelectItem>
                            <SelectItem value={BookCondition.BAD}>Mala</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="book-form__field">
                    <Label htmlFor="shelf" className="book-form__label">Estante</Label>
                    <Input
                        id="shelf"
                        {...register("shelf", { required: "El estante es requerido" })}
                        className="book-form__input"
                    />
                </div>
                <div className="book-form__field">
                    <Label htmlFor="shelfColor" className="book-form__label">Color del Estante</Label>
                    <Input
                        id="shelfColor"
                        {...register("shelfColor", { required: "El color del estante es requerido" })}
                        className="book-form__input"
                    />
                </div>
                <div className="book-form__field">
                    <Label htmlFor="shelfLevel" className="book-form__label">Nivel del Estante</Label>
                    <Input
                        id="shelfLevel"
                        {...register("shelfLevel", { required: "El nivel del estante es requerido" })}
                        className="book-form__input"
                    />
                </div>
                <div className="book-form__field">
                    <Label htmlFor="publisherName" className="book-form__label">Nombre de la Editorial</Label>
                    <Input
                        id="publisherName"
                        {...register("publisherName", { required: "El nombre de la editorial es requerido" })}
                        className="book-form__input"
                    />
                </div>
                <div className="book-form__field">
                    <Label htmlFor="publisherEmail" className="book-form__label">Email de la Editorial</Label>
                    <Input
                        id="publisherEmail"
                        type="email"
                        {...register("publisherEmail", { required: "El email de la editorial es requerido" })}
                        className="book-form__input"
                    />
                </div>
                <div className="book-form__field">
                    <Label htmlFor="publisherCountry" className="book-form__label">País de la Editorial</Label>
                    <Input
                        id="publisherCountry"
                        {...register("publisherCountry", { required: "El país de la editorial es requerido" })}
                        className="book-form__input"
                    />
                </div>
                <div className="book-form__field">
                    <Label htmlFor="publisherAddress" className="book-form__label">Dirección de la Editorial</Label>
                    <Input
                        id="publisherAddress"
                        {...register("publisherAddress", { required: "La dirección de la editorial es requerida" })}
                        className="book-form__input"
                    />
                </div>
                <div className="book-form__field">
                    <Label htmlFor="publisherPhone" className="book-form__label">Teléfono de la Editorial</Label>
                    <Input
                        id="publisherPhone"
                        {...register("publisherPhone", { required: "El teléfono de la editorial es requerido" })}
                        className="book-form__input"
                    />
                </div>
                <div className="book-form__field">
                    <Label htmlFor="publisherWebsite" className="book-form__label">Sitio Web de la Editorial</Label>
                    <Input
                        id="publisherWebsite"
                        type="url"
                        {...register("publisherWebsite", { required: "El sitio web de la editorial es requerido" })}
                        className="book-form__input"
                    />
                </div>
                <div className="book-form__field">
                    <Label htmlFor="bookId" className="book-form__label">ID del Libro</Label>
                    <Input
                        id="bookId"
                        type="number"
                        {...register("bookId", { required: "El ID del libro es requerido", valueAsNumber: true })}
                        className="book-form__input book-form__input-number book-form__input-number--no-arrows"
                    />
                </div>
                <div className="pt-3">
                    <Button type="submit" className="book-form__submit">
                        Guardar Copia
                    </Button>
                </div>
            </form>
        </div>
    );
}


