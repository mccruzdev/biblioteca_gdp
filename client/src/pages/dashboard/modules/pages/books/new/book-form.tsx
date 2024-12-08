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
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-right text-[#C7C7CC]">Título</Label>
        <Input
          id="title"
          {...register("title", { required: "El título es requerido" })}
          className="mt-1 bg-[#141414] border-[#3e3e40] text-[#C7C7CC] focus:border-[#FFBC24] focus:ring-[#FFBC24]"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="pages" className="text-right text-[#C7C7CC]">Páginas</Label>
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
          className="mt-1 bg-[#141414] border-[#3e3e40] text-[#C7C7CC] focus:border-[#FFBC24] focus:ring-[#FFBC24] [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:hover:bg-[#FFBC24]/20"
        />
        {errors.pages && (
          <p className="text-red-500 text-sm mt-1">{errors.pages.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="authors" className="text-right text-[#C7C7CC]">Autor</Label>
        <Input
          id="authors"
          {...register("authors", { required: "El autor es requerido" })}
          className="mt-1 bg-[#141414] border-[#3e3e40] text-[#C7C7CC] focus:border-[#FFBC24] focus:ring-[#FFBC24]"
        />
        {errors.authors && (
          <p className="text-red-500 text-sm mt-1">{errors.authors.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="category" className="text-right text-[#C7C7CC]">Categoría</Label>
        <Input
          id="category"
          {...register("category", { required: "La categoría es requerida" })}
          className="mt-1 bg-[#141414] border-[#3e3e40] text-[#C7C7CC] focus:border-[#FFBC24] focus:ring-[#FFBC24]"
        />
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="subcategory" className="text-right text-[#C7C7CC]">Subcategoría</Label>
        <Input
          id="subcategory"
          {...register("subcategory", { required: "La subcategoría es requerida" })}
          className="mt-1 bg-[#141414] border-[#3e3e40] text-[#C7C7CC] focus:border-[#FFBC24] focus:ring-[#FFBC24]"
        />
        {errors.subcategory && (
          <p className="text-red-500 text-sm mt-1">{errors.subcategory.message as string}</p>
        )}
      </div>

      <div className="pt-3">
        <Button
          type="submit"
          className="w-full bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/80 focus:ring-2 focus:ring-[#FFBC24] focus:ring-offset-2 focus:ring-offset-[#0e0e0e] transition-colors"
        >
          Guardar
        </Button>
      </div>
    </form>
  );
}

