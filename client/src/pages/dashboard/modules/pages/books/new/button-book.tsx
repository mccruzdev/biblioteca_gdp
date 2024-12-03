import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../../../../components/ui/dialog"
import { Button } from "../../../../../../components/ui/button";
import {BookForm} from './book-form';

export default function NewBook() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Agregar</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agrega un nuevo libro</DialogTitle>
                </DialogHeader>
                <BookForm />
            </DialogContent>
        </Dialog>
    );
}