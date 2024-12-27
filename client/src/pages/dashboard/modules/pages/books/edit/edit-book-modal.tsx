import React from "react";
import { useForm } from "react-hook-form";
import { BookI } from "../../../../../../types";
import { Button } from "../../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog";
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
  book: BookI | null;
}

export function EditBookModal({
  isOpen,
  onClose,
  onSubmit,
  book,
}: EditBookModalProps) {
  const { register, handleSubmit, reset } = useForm();

  React.useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        pages: book.pages,
        author: book.authors[0]?.name || "",
        category: book.category,
        subcategory: book.subcategory,
      });
    }
  }, [book, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="edit-book-modal__content">
        <DialogHeader>
          <DialogTitle>Editar Libro</DialogTitle>
          <DialogDescription>
            Modifica los detalles del libro y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="edit-book-modal__form"
        >
          <div className="edit-book-modal__field">
            <Label htmlFor="title" className="edit-book-modal__label">
              Título
            </Label>
            <Input
              id="title"
              className="edit-book-modal__input"
              {...register("title", { required: true })}
            />
          </div>
          <div className="edit-book-modal__field">
            <Label htmlFor="pages" className="edit-book-modal__label">
              Páginas
            </Label>
            <Input
              id="pages"
              type="number"
              min="1"
              className="edit-book-modal__input"
              {...register("pages", {
                required: true,
                validate: (value) => parseInt(value) > 0,
              })}
            />
          </div>
          <div className="edit-book-modal__field">
            <Label htmlFor="author" className="edit-book-modal__label">
              Autor
            </Label>
            <Input
              id="author"
              className="edit-book-modal__input"
              {...register("author", { required: true })}
            />
          </div>
          <div className="edit-book-modal__field">
            <Label htmlFor="category" className="edit-book-modal__label">
              Categoría
            </Label>
            <Input
              id="category"
              className="edit-book-modal__input"
              {...register("category", { required: true })}
            />
          </div>
          <div className="edit-book-modal__field">
            <Label htmlFor="subcategory" className="edit-book-modal__label">
              Subcategoría
            </Label>
            <Input
              id="subcategory"
              className="edit-book-modal__input"
              {...register("subcategory", { required: true })}
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
  );
}
