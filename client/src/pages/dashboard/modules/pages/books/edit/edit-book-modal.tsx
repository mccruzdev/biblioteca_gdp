import React from "react"
import { useForm } from "react-hook-form"
import { BookI } from "../../../../../../types"
import { Button } from "../../../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../../../components/ui/dialog"
import { Label } from "../../../../../../components/ui/label"
import { Input } from "../../../../../../components/ui/input"

interface EditBookModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
    book: BookI | null
}

export function EditBookModal({ isOpen, onClose, onSubmit, book }: EditBookModalProps) {
    const { register, handleSubmit, reset } = useForm()

    React.useEffect(() => {
        if (book) {
            reset({
                title: book.title,
                pages: book.pages,
                author: book.authors[0]?.name || "",
                category: book.category,
                subcategory: book.subcategory,
            })
        }
    }, [book, reset])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-[#0e0e0e] text-[#C7C7CC]">
                <DialogHeader>
                    <DialogTitle>Editar Libro</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles del libro y guarda los cambios.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Título
                            </Label>
                            <Input
                                id="title"
                                className="col-span-3"
                                {...register("title", { required: true })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="pages" className="text-right">
                                Páginas
                            </Label>
                            <Input
                                id="pages"
                                type="number"
                                min="1"
                                className="col-span-3"
                                {...register("pages", {
                                    required: true,
                                    validate: (value) => parseInt(value) > 0
                                })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="author" className="text-right">
                                Autor
                            </Label>
                            <Input
                                id="author"
                                className="col-span-3"
                                {...register("author", { required: true })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Categoría
                            </Label>
                            <Input
                                id="category"
                                className="col-span-3"
                                {...register("category", { required: true })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subcategory" className="text-right">
                                Subcategoría
                            </Label>
                            <Input
                                id="subcategory"
                                className="col-span-3"
                                {...register("subcategory", { required: true })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="bg-[#141414] text-[#C7C7CC] hover:bg-[#141414] hover:text-[#FFBC24] hover:border-[#FFBC24] border-[#3e3e40]"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90"
                        >
                            Guardar cambios
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

