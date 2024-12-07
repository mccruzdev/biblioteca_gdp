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

export default function NewBook() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer bg-[#FFBC24] text-[#010101] hover:opacity-80 focus:bg-[#FFBC24] focus:text-[#010101]"
          variant="outline"
        >
          Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agrega un nuevo libro</DialogTitle>
        </DialogHeader>
        <BookForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
