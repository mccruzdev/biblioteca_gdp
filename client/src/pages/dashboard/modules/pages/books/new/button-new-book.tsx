import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../../../components/ui/dialog";
import { Button } from "../../../../../../components/ui/button";
import { BookForm } from "./new-book-modal";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function NewBook() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="new-book__button">
          <Plus className="new-book__icon" />
          Agregar Libro
        </Button>
      </DialogTrigger>
      <DialogContent className="new-book__dialog-content">
        <DialogHeader>
          <DialogTitle className="new-book__dialog-title">Agrega un nuevo libro</DialogTitle>
        </DialogHeader>
        <BookForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

