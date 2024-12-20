import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../../../../../../components/ui/dialog";
import { useState } from "react";
import { Button } from "../../../../../../components/ui/button";
import { Plus } from 'lucide-react';
import { DonorForm } from "./donor-new-modal";

export function NewDonor() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="new-book__button">
                    <Plus className="new-book__icon" />
                    Agregar Donador
                </Button>
            </DialogTrigger>

            <DialogContent className="new-book__dialog-content">
                <DialogHeader>
                    <DialogTitle className="new-book___dialog-title">Agrega un nuevo donador</DialogTitle>
                </DialogHeader>
                <DonorForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>

    );
}

