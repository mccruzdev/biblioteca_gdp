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
                <Button className="cursor-pointer bg-[#FFBC24] text-[#010101] hover:opacity-80 focus:bg-[#FFBC24] focus:text-[#010101]" variant="outline">Agregar</Button>
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