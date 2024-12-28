import { BookI, DonationsI, DonorsI, Loan, Item } from "../../../../types";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

interface ItemTableMobileProps {
  items: Item[];
  mode:
    | "books"
    | "reservations"
    | "loans"
    | "loans-history"
    | "Donors"
    | "Donations";
  viewMode:
    | "books"
    | "catalog"
    | "loan"
    | "loan-history"
    | "Donors"
    | "Donations";
  onEdit?: (item: BookI) => void;
  onDelete?: (item: BookI) => void;
  onReserve?: (item: BookI) => void;
  onLoan: (item: Item) => void;
  onReturn?: (item: Loan) => void;
  onConvertToLoan: (item: Item) => void;
  onReservationStatus: (item: Item) => void;
  onLoanStatus: (item: Item) => void;
  onEditDonor: (item: Item) => void;
  onDeleteDonor: (item: Item) => void;
  // onEditDonation: (item: Item) => void;
  onDeleteDonation: (item: Item) => void;
}

export function ItemTableMobile({
  items,
  mode,
  viewMode,
  onEdit,
  onDelete,
  onReserve,
  onConvertToLoan,
  onReservationStatus,
  onLoanStatus,
  onEditDonor,
  onDeleteDonor,
  // onEditDonation,
  onDeleteDonation,
}: ItemTableMobileProps) {
  const isBook = (item: Item): item is BookI => "title" in item;
  const isLoan = (item: Item): item is Loan => "loanDate" in item;
  const isDonations = (item: Item): item is DonationsI => "donor" in item;
  const isDonors = (item: Item): item is DonorsI => "name" in item;

  return (
    <div className="item-table__mobile">
      {items.map((item) => (
        <Card key={item.id} className="item-table__card mb-4">
          <CardHeader>
            <CardTitle>
              {isBook(item)
                ? item.title
                : `${mode === "loans" ? "Préstamo" : "Reserva"} #${item.id}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDonations(item) ? (
              <>
                <p>
                  <strong>Fecha de Donación:</strong>
                  {item.date}
                </p>
                <p>
                  <strong>Descripción:</strong>
                  {item.description}
                </p>
                <p>
                  <strong>Donador:</strong>
                  {item.donor.name}
                </p>
              </>
            ) : isDonors(item) ? (
              <>
                <p>
                  <strong>ID:</strong> {item.id}
                </p>
                <p>
                  <strong>Nombre:</strong> {item.name}
                </p>
                <p>
                  <strong>Email:</strong> {item.email}
                </p>
              </>
            ) : isBook(item) ? (
              <>
                <p>
                  <strong>ID:</strong> {item.id}
                </p>
                <p>
                  <strong>Páginas:</strong> {item.pages}
                </p>
                <p>
                  <strong>Autor:</strong>{" "}
                  {item.authors[0] ? item.authors[0].name : "Desconocido"}
                </p>
                <p>
                  <strong>Categoría:</strong> {item.category}
                </p>
                <p>
                  <strong>Subcategoría:</strong> {item.subcategory}
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>ID Libro:</strong> {item.bookId || "N/A"}
                </p>
                <p>
                  <strong>Libro:</strong> {item.bookTitle || "Cargando..."}
                </p>
                <p>
                  <strong>
                    {mode === "loans"
                      ? "Fecha de Préstamo"
                      : "Fecha de Creación"}
                    :
                  </strong>{" "}
                  {new Date(
                    isLoan(item) ? item.loanDate : item.created
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>Fecha de Vencimiento:</strong>{" "}
                  {new Date(item.dueDate).toLocaleString()}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {item.status === "ACTIVE"
                    ? "Activo"
                    : item.status === "RETURNED"
                    ? "Retornado"
                    : item.status === "OVERDUE"
                    ? "Atrasado"
                    : item.status === "PENDING"
                    ? "Pendiente"
                    : item.status === "PICKED_UP"
                    ? "Recogido"
                    : item.status === "CANCELED"
                    ? "Cancelado"
                    : "Expirado"}
                </p>
                <p>
                  <strong>Copia:</strong> {item.copies[0]?.code || "N/A"}
                </p>
              </>
            )}
            {mode !== "loans-history" && (
              <div className="mt-4 space-x-2">
                {viewMode === "books" && isBook(item) && (
                  <>
                    {onEdit && (
                      <Button
                        onClick={() => onEdit(item)}
                        className="item-table__button"
                      >
                        Editar
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        onClick={() => onDelete(item)}
                        className="item-table__button"
                      >
                        Eliminar
                      </Button>
                    )}
                  </>
                )}
                {viewMode === "catalog" && isBook(item) && onReserve && (
                  <Button
                    onClick={() => onReserve(item)}
                    className="item-table__button"
                  >
                    Reservar
                  </Button>
                )}
                {viewMode === "loan" && (
                  <>
                    <Button
                      onClick={() => onConvertToLoan(item)}
                      className="item-table__button"
                    >
                      Préstamo
                    </Button>
                    <Button
                      onClick={() => onReservationStatus(item)}
                      className="item-table__button"
                    >
                      Estado
                    </Button>
                  </>
                )}
                {viewMode === "loan-history" && (
                  <Button
                    onClick={() => onLoanStatus(item)}
                    className="item-table__button"
                  >
                    Estado
                  </Button>
                )}
                {viewMode === "Donors" && (
                  <>
                    {onEditDonor && (
                      <Button
                        onClick={() => onEditDonor(item)}
                        className="item-table__button"
                      >
                        Editar
                      </Button>
                    )}
                    {onDeleteDonor && (
                      <Button
                        onClick={() => onDeleteDonor(item)}
                        className="item-table__button"
                      >
                        Eliminar
                      </Button>
                    )}
                  </>
                )}

                {viewMode === "Donations" && (
                  <>
                    {/* {onEditDonation && (
                                        <Button
                                            onClick={() => onEditDonation(item)}
                                            className="item-table__button"
                                        >
                                            Editar
                                        </Button>
                                    )} */}
                    {onDeleteDonation && (
                      <Button
                        onClick={() => onDeleteDonation(item)}
                        className="item-table__button"
                      >
                        Eliminar
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
