import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../../../../../components/ui/alert-dialog";
import { DropdownMenuItem } from "../../../../../../components/ui/dropdown-menu";
import { useTokenUC } from "../../../../../../context/user/user.hook";
import { booksApi } from "../books.api";
import { useToast } from "../../../../../../hooks/use-toast";
import { BookI } from "../../../../../../types";

interface ButtonDeleteProps {
    book: BookI;
    onDeleted?: () => void;
}

export function ButtonDelete({ book, onDeleted }: ButtonDeleteProps) {
    const [open, setOpen] = useState(false);
    const { data: token } = useTokenUC();
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!token) return;

        try {
            await booksApi.deleteBook(book.id.toString(), token);
            
            toast({
                title: "Éxito",
                description: `El libro "${book.title}" ha sido eliminado`,
            });

            onDeleted?.();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error al eliminar el libro",
                variant: "destructive",
            });
        } finally {
            setOpen(false);
        }
    };

    return (
        <>
            <DropdownMenuItem
                onClick={() => setOpen(true)}
                className="cursor-pointer bg-[#FFBC24] text-[#010101] hover:opacity-70 focus:bg-[#FFBC24] focus:text-[#010101]"
            >
                Eliminar
            </DropdownMenuItem>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el libro
                            "{book.title}" y todos sus datos asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
