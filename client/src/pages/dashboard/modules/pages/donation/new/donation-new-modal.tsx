import { useState } from "react";
import { useForm, useFieldArray, FieldValues } from "react-hook-form";
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import { Button } from "../../../../../../components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../../../components/ui/select";
import { useTokenUC } from "../../../../../../context/user/user.hook";
import { DonationDTO, donationsApi } from "../donations.api";
import { useToast } from "../../../../../../hooks/use-toast";
import { ToastAction } from "../../../../../../components/ui/toast";
import { BookCondition } from "../../books/books.api";
import { ScrollArea } from "../../../../../../components/ui/scroll-area";

interface DonationFormProps {
    onSuccess?: () => void;
}

export function DonationForm({ onSuccess }: DonationFormProps) {
    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<FieldValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "copies"
    });
    const { toast } = useToast();
    const { data: token } = useTokenUC();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = handleSubmit(async (data) => {
        if (!token) {
            toast({
                title: "Error",
                description: "No se pudo autenticar. Por favor, inicie sesión nuevamente.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        const donationData: DonationDTO = {
            donorId: parseInt(data.donorId, 10),
            description: data.description,
            copies: data.copies.map((copy: any) => ({
                code: copy.code,
                condition: copy.condition,
                location: {
                    shelf: copy.shelf,
                    shelfColor: copy.shelfColor,
                    shelfLevel: copy.shelfLevel,
                },
                publisher: {
                    name: copy.publisherName,
                    email: copy.publisherEmail,
                    country: copy.publisherCountry,
                    address: copy.publisherAddress,
                    phoneNumber: copy.publisherPhone,
                    website: copy.publisherWebsite,
                },
                bookId: parseInt(copy.bookId, 10),
            })),
        };

        try {
            const result = await donationsApi.createDonation(donationData, token);

            toast({
                title: "Éxito",
                description: result.message || "La donación ha sido registrada exitosamente",
                action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
            });

            onSuccess?.();
        } catch (error) {
            console.error('Error creating donation:', error);
            toast({
                title: "Error",
                description: "Hubo un problema al registrar la donación. Por favor, inténtalo de nuevo.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    });

    return (
        <div className="flex h-[80vh]">
            <ScrollArea className="flex-1 p-6">
                <form onSubmit={onSubmit} className="space-y-6">
                    <div id="donorInfo">
                        <h4 className="text-lg font-semibold mb-4">Información del Donante</h4>
                        <div className="space-y-4">
                            <div className="book-form__field">
                                <Label htmlFor="donorId" className="book-form__label">ID del Donante</Label>
                                <Input
                                    id="donorId"
                                    type="number"
                                    {...register("donorId", { required: "El ID del donante es requerido" })}
                                    className="book-form__input book-form__input-number book-form__input-number--no-arrows"
                                />
                                {errors.donorId && (
                                    <p className="book-form__error">{errors.donorId.message as string}</p>
                                )}
                            </div>

                            <div className="book-form__field">
                                <Label htmlFor="description" className="book-form__label">Descripción de la Donación</Label>
                                <Input
                                    id="description"
                                    {...register("description", { required: "La descripción es requerida" })}
                                    className="book-form__input"
                                />
                                {errors.description && (
                                    <p className="book-form__error">{errors.description.message as string}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div id="copies">
                        <h4 className="text-lg font-semibold mb-4">Copias de Libros</h4>
                        {fields.map((field, index) => (
                            <div key={field.id} className="book-form__copy mb-6 p-4 border border-gray-200 rounded-md">
                                <h5 className="text-md font-semibold mb-2">Copia {index + 1}</h5>

                                <div className="book-form__field">
                                    <Label htmlFor={`copies.${index}.code`} className="book-form__label">Código</Label>
                                    <Input
                                        {...register(`copies.${index}.code`, { required: "El código es requerido" })}
                                        className="book-form__input"
                                    />
                                </div>

                                <div className="book-form__field">
                                    <Label htmlFor={`copies.${index}.condition`} className="book-form__label">Condición</Label>
                                    <Select onValueChange={(value) => setValue(`copies.${index}.condition`, value)}>
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
                                    <Label htmlFor={`copies.${index}.shelf`} className="book-form__label">Estante</Label>
                                    <Input
                                        {...register(`copies.${index}.shelf`, { required: "El estante es requerido" })}
                                        className="book-form__input"
                                    />
                                </div>

                                <div className="book-form__field">
                                    <Label htmlFor={`copies.${index}.shelfColor`} className="book-form__label">Color del Estante</Label>
                                    <Input
                                        {...register(`copies.${index}.shelfColor`, { required: "El color del estante es requerido" })}
                                        className="book-form__input"
                                    />
                                </div>

                                <div className="book-form__field">
                                    <Label htmlFor={`copies.${index}.shelfLevel`} className="book-form__label">Nivel del Estante</Label>
                                    <Input
                                        {...register(`copies.${index}.shelfLevel`, { required: "El nivel del estante es requerido" })}
                                        className="book-form__input"
                                    />
                                </div>

                                <div className="book-form__field">
                                    <Label htmlFor={`copies.${index}.publisherName`} className="book-form__label">Nombre de la Editorial</Label>
                                    <Input
                                        {...register(`copies.${index}.publisherName`, { required: "El nombre de la editorial es requerido" })}
                                        className="book-form__input"
                                    />
                                </div>

                                <div className="book-form__field">
                                    <Label htmlFor={`copies.${index}.publisherEmail`} className="book-form__label">Email de la Editorial</Label>
                                    <Input
                                        type="email"
                                        {...register(`copies.${index}.publisherEmail`, { required: "El email de la editorial es requerido" })}
                                        className="book-form__input"
                                    />
                                </div>

                                <div className="book-form__field">
                                    <Label htmlFor={`copies.${index}.publisherCountry`} className="book-form__label">País de la Editorial</Label>
                                    <Input
                                        {...register(`copies.${index}.publisherCountry`, { required: "El país de la editorial es requerido" })}
                                        className="book-form__input"
                                    />
                                </div>

                                <div className="book-form__field">
                                    <Label htmlFor={`copies.${index}.publisherAddress`} className="book-form__label">Dirección de la Editorial</Label>
                                    <Input
                                        {...register(`copies.${index}.publisherAddress`, { required: "La dirección de la editorial es requerida" })}
                                        className="book-form__input"
                                    />
                                </div>

                                <div className="book-form__field">
                                    <Label htmlFor={`copies.${index}.publisherPhone`} className="book-form__label">Teléfono de la Editorial</Label>
                                    <Input
                                        {...register(`copies.${index}.publisherPhone`, { required: "El teléfono de la editorial es requerido" })}
                                        className="book-form__input"
                                    />
                                </div>

                                <div className="book-form__field">
                                    <Label htmlFor={`copies.${index}.publisherWebsite`} className="book-form__label">Sitio Web de la Editorial</Label>
                                    <Input
                                        type="url"
                                        {...register(`copies.${index}.publisherWebsite`, { required: "El sitio web de la editorial es requerido" })}
                                        className="book-form__input"
                                    />
                                </div>

                                <div className="book-form__field">
                                    <Label htmlFor={`copies.${index}.bookId`} className="book-form__label">ID del Libro</Label>
                                    <Input
                                        type="number"
                                        {...register(`copies.${index}.bookId`, { required: "El ID del libro es requerido", valueAsNumber: true })}
                                        className="book-form__input book-form__input-number book-form__input-number--no-arrows"
                                    />
                                </div>

                                <Button type="button" onClick={() => remove(index)} className="book-form__remove-copy mt-2">
                                    Eliminar Copia
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={() => append({})} className="book-form__add-copy">
                            Agregar Copia
                        </Button>
                    </div>

                    <div className="pt-3">
                        <Button type="submit" className="book-form__submit" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : "Guardar Donación"}
                        </Button>
                    </div>
                </form>
            </ScrollArea>
        </div>
    );
}
