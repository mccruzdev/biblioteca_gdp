"use client";
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import { useForm, FieldValues } from "react-hook-form";
import { Button } from "../../../../../../components/ui/button";
import { useTokenUC } from "../../../../../../context/user/user.hook";
import { booksApi } from "../books.api";
import { useToast } from "../../../../../../hooks/use-toast";
import { ToastAction } from "../../../../../../components/ui/toast";
import { useState } from "react";

interface BookFormProps {
  onSuccess?: () => void;
}

export function BookForm({ onSuccess }: BookFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();
  const { data: token } = useTokenUC();
  const { toast } = useToast();
  const [pages, setPages] = useState<number>(1);

  const onSubmit = handleSubmit(async (data) => {
    if (!token) return;

    const bookData = {
      title: data.title,
      pages: Number(data.pages),
      authors: [{ name: data.authors }],
      category: data.category,
      subcategory: data.subcategory,
    };

    console.log('Datos a enviar:', bookData); // Para debug

    try {
      const response = await booksApi.createBook(bookData, token);
      console.log('Respuesta:', response); // Para debug

      toast({
        title: "Éxito",
        description: `El libro "${data.title}" ha sido creado`,
        action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
      });

      onSuccess?.(); // Llamamos a onSuccess si existe
    } catch (error) {
      console.error('Error completo:', error); // Para debug
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al crear el libro",
        variant: "destructive",
      });
    }
  });

  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setPages(value);
    } else {
      setPages(1);
      e.target.value = '1';
    }
  };

  return (
    <form onSubmit={onSubmit} className="book-form__container">
      <div>
        <Label htmlFor="title" className="book-form__label">Título</Label>
        <Input
          id="title"
          {...register("title", { required: "El título es requerido" })}
          className="book-form__input"
        />
        {errors.title && (
          <p className="book-form__error">{errors.title.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="pages" className="book-form__label">Páginas</Label>
        <Input
          id="pages"
          type="number"
          min="1"
          value={pages}
          {...register("pages", {
            required: "El número de páginas es requerido",
            min: { value: 1, message: "El número de páginas debe ser mayor que 0" },
            valueAsNumber: true,
            onChange: (e) => handlePagesChange(e)
          })}
          className="book-form__input-number"
        />
        {errors.pages && (
          <p className="book-form__error">{errors.pages.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="authors" className="book-form__label">Autor</Label>
        <Input
          id="authors"
          {...register("authors", { required: "El autor es requerido" })}
          className="book-form__input"
        />
        {errors.authors && (
          <p className="book-form__error">{errors.authors.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="category" className="book-form__label">Categoría</Label>
        <Input
          id="category"
          {...register("category", { required: "La categoría es requerida" })}
          className="book-form__input"
        />
        {errors.category && (
          <p className="book-form__error">{errors.category.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="subcategory" className="book-form__label">Subcategoría</Label>
        <Input
          id="subcategory"
          {...register("subcategory", { required: "La subcategoría es requerida" })}
          className="book-form__input"
        />
        {errors.subcategory && (
          <p className="book-form__error">{errors.subcategory.message as string}</p>
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

