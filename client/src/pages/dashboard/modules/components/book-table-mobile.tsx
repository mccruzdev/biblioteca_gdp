import { BookI } from "../../../../types"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"

interface BookTableMobileProps {
    books: BookI[]
    mode: 'crud' | 'reservation'
    onEdit: (book: BookI) => void
    onDelete: (book: BookI) => void
    onReserve: (book: BookI) => void
}

export function BookTableMobile({ books, mode, onEdit, onDelete, onReserve }: BookTableMobileProps) {
    return (
        <div className="md:hidden">
            {books.map((book) => (
                <Card key={book.id} className="mb-4 border-[#3e3e40] bg-[#0e0e0e] text-[#C7C7CC]">
                    <CardHeader>
                        <CardTitle>{book.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>ID:</strong> {book.id}</p>
                        <p><strong>Páginas:</strong> {book.pages}</p>
                        <p><strong>Autor:</strong> {book.authors[0] ? book.authors[0].name : "Desconocido"}</p>
                        <p><strong>Categoría:</strong> {book.category}</p>
                        <p><strong>Subcategoría:</strong> {book.subcategory}</p>
                        {mode === 'crud' ? (
                            <>
                                <Button onClick={() => onEdit(book)} className="mt-2 mr-2 bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90">
                                    Editar
                                </Button>
                                <Button onClick={() => onDelete(book)} className="mt-2 bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90">
                                    Eliminar
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => onReserve(book)} className="mt-2 bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90">
                                Reservar
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

