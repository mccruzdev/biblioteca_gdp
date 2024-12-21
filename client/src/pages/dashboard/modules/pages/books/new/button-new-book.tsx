import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../../../components/ui/dialog";
import { useState } from "react";
import { BookForm } from "./new-book-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../../components/ui/tabs";
import { CopyForm } from "./copy-form";
import { Button } from "../../../../../../components/ui/button";
import { Plus } from 'lucide-react';

export function AddNewDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="new-book__dialog-content">
        <DialogHeader>
          <DialogTitle className="new-book__dialog-title">Agregar Nuevo</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="book" className="w-full">
          <TabsList className="grid w-full grid-cols-2 new-book__tabs-list">
            <TabsTrigger value="book" className="new-book__tab-trigger">Libro</TabsTrigger>
            <TabsTrigger value="copy" className="new-book__tab-trigger">Copia</TabsTrigger>
          </TabsList>
          <TabsContent value="book">
            <BookForm onSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="copy">
            <CopyForm onSuccess={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export function NewBook() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="new-book__button">
          <Plus className="new-book__icon" />
          Agregar Libro
        </Button>
      </DialogTrigger>
      <AddNewDialog open={open} setOpen={setOpen} />
    </Dialog>
  );
}

