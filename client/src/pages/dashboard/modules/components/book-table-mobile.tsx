import { BookI } from "../../../../types"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"

interface BookTableMobileProps {
    books: BookI[]
    mode: 'crud' | 'reservation' | 'loan'
    onEdit: (book: BookI) => void
    onDelete: (book: BookI) => void
    onReserve: (book: BookI) => void
    onLoan: (book: BookI) => void
}

export function BookTableMobile({ books, mode, onEdit, onDelete, onReserve, onLoan }: BookTableMobileProps) {
    return (
        <div className="book-table__mobile">
            {books.map((book) => (
                <Card key={book.id} className="book-table__card">
                    <CardHeader>
                        <CardTitle>{book.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>ID:</strong> {book.id}</p>
                        <p><strong>Páginas:</strong> {book.pages}</p>
                        <p><strong>Autor:</strong> {book.authors[0] ? book.authors[0].name : "Desconocido"}</p>
                        <p><strong>Categoría:</strong> {book.category}</p>
                        <p><strong>Subcategoría:</strong> {book.subcategory}</p>
                        {mode === 'crud' && (
                            <>
                                <Button onClick={() => onEdit(book)} className="book-table__button">
                                    Editar
                                </Button>
                                <Button onClick={() => onDelete(book)} className="book-table__button">
                                    Eliminar
                                </Button>
                            </>
                        )}
                        {mode === 'reservation' && (
                            <Button onClick={() => onReserve(book)} className="book-table__button">
                                Reservar
                            </Button>
                        )}
                        {mode === 'loan' && (
                            <Button onClick={() => onLoan(book)} className="book-table__button">
                                Préstamo
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

