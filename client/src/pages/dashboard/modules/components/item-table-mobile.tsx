import { BookI } from "../../../../types"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Copy } from "../pages/loan/loan.api"

interface Reservation {
    id: number;
    created: string;
    dueDate: string;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    copies: Copy[];
    bookTitle?: string;
    bookId?: number;
}

type Item = BookI | Reservation;

interface ItemTableMobileProps {
    items: Item[];
    mode: 'books' | 'reservations';
    viewMode: 'books' | 'catalog' | 'loan';
    onEdit?: (item: BookI) => void;
    onDelete?: (item: BookI) => void;
    onReserve?: (item: BookI) => void;
    onLoan: (item: Item) => void;
}

export function ItemTableMobile({ items, mode, viewMode, onEdit, onDelete, onReserve, onLoan }: ItemTableMobileProps) {
    const isBook = (item: Item): item is BookI => 'title' in item;

    return (
        <div className={`${mode}-table__mobile`}>
            {items.map((item) => (
                <Card key={item.id} className={`${mode}-table__card mb-4`}>
                    <CardHeader>
                        <CardTitle>
                            {isBook(item) ? item.title : `Reserva #${item.id}`}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isBook(item) ? (
                            <>
                                <p><strong>ID:</strong> {item.id}</p>
                                <p><strong>Páginas:</strong> {item.pages}</p>
                                <p><strong>Autor:</strong> {item.authors[0] ? item.authors[0].name : "Desconocido"}</p>
                                <p><strong>Categoría:</strong> {item.category}</p>
                                <p><strong>Subcategoría:</strong> {item.subcategory}</p>
                            </>
                        ) : (
                            <>
                                <p><strong>ID Libro:</strong> {item.bookId || 'N/A'}</p>
                                <p><strong>Libro:</strong> {item.bookTitle || 'Cargando...'}</p>
                                <p><strong>Fecha de Creación:</strong> {new Date(item.created).toLocaleString()}</p>
                                <p><strong>Fecha de Reserva:</strong> {new Date(item.dueDate).toLocaleString()}</p>
                                <p><strong>Estado:</strong> {item.status}</p>
                                <p><strong>Copia:</strong> {item.copies[0]?.code || 'N/A'}</p>
                            </>
                        )}
                        <div className="mt-4 space-x-2">
                            {viewMode === 'books' && isBook(item) && (
                                <>
                                    {onEdit && (
                                        <Button onClick={() => onEdit(item)} className={`${mode}-table__button`}>
                                            Editar
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button onClick={() => onDelete(item)} className={`${mode}-table__button`}>
                                            Eliminar
                                        </Button>
                                    )}
                                </>
                            )}
                            {viewMode === 'catalog' && isBook(item) && onReserve && (
                                <Button onClick={() => onReserve(item)} className={`${mode}-table__button`}>
                                    Reservar
                                </Button>
                            )}
                            {viewMode === 'loan' && (
                                <Button
                                    onClick={() => onLoan(item)}
                                    className={`${mode}-table__button`}
                                >
                                    {mode === 'books' ? 'Préstamo' : 'Convertir a préstamo'}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
