import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../../components/ui/dialog";
import { Button } from "../../../../../../components/ui/button";
import { BookForm } from "./book-form";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function NewBook() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/80 focus:ring-2 focus:ring-[#FFBC24] focus:ring-offset-2 focus:ring-offset-[#0e0e0e]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Libro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0e0e0e] text-[#C7C7CC] border-[#3e3e40]">
        <DialogHeader>
          <DialogTitle className="text-[#FFBC24]">Agrega un nuevo libro</DialogTitle>
        </DialogHeader>
        <BookForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

