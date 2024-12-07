"use client";
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../../components/ui/button";
import { useTokenUC } from "../../../../../../context/user/user.hook";
import { booksApi } from "../books.api";
import { useToast } from "../../../../../../hooks/use-toast";
import { ToastAction } from "../../../../../../components/ui/toast";

interface BookFormProps {
  onSuccess?: () => void;
}

export function BookForm({ onSuccess }: BookFormProps) {
  const {
    register,
    handleSubmit,
    //formState: { errors }
  } = useForm();
  const { data: token } = useTokenUC();
  const { toast } = useToast();

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

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label className="text-right">Título</Label>
        <Input 
          {...register("title", { required: true })}
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-right">Páginas</Label>
        <Input 
          type="number"
          {...register("pages", { 
            required: true,
            min: 1,
            valueAsNumber: true 
          })}
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-right">Autor</Label>
        <Input 
          {...register("authors", { required: true })}
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-right">Categoría</Label>
        <Input 
          {...register("category", { required: true })}
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-right">Subcategoría</Label>
        <Input 
          {...register("subcategory", { required: true })}
          className="mt-1"
        />
      </div>

      <div className="pt-3">
        <Button type="submit" className="w-full">
          Guardar
        </Button>
      </div>
    </form>
  );
}
