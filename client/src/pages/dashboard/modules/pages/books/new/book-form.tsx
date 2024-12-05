"use client";
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../../components/ui/button";
//import { createBook } from "../books.api";
import { useTokenUC } from "../../../../../../context/user/user.hook";
import { fetchJSON } from "../../../../../../services/fetch";
import { BACKEND_SERVER } from "../../../../../../config/api";

export function BookForm() {
  const { data: token } = useTokenUC();
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    if (!token) return;

    const createdBookResponse = await fetchJSON<any>(`${BACKEND_SERVER}/book`, {
      method: "POST",
      authorization: token,
      body: {
        ...data,
        authors: [{name: data.authors}],
        pages: parseInt(data.pages),
      },
    });

    console.log(createdBookResponse);
  });

  return (
    <form onSubmit={onSubmit}>
      <Label className="text-right">Título</Label>
      <Input {...register("title")} />

      <Label className="text-right">Paginas</Label>
      <Input {...register("pages")} />

      <Label className="text-right">Autor</Label>
      <Input {...register("authors")} />

      <Label className="text-right">Categoría</Label>
      <Input {...register("category")} />

      <Label className="text-right">Subcategoría</Label>
      <Input {...register("subcategory")} />
      <div className="pt-3">
        <Button>Guardar</Button>
      </div>
    </form>
  );
}
