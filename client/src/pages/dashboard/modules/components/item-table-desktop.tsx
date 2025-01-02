import { MoreHorizontal } from "lucide-react";
import { BookI, Loan, Item, DonationsI, DonorsI } from "../../../../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

interface ItemTableDesktopProps {
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
  showActions: boolean;
}

export function ItemTableDesktop({
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
  showActions,
}: ItemTableDesktopProps) {
  const isBook = (item: Item): item is BookI => "title" in item;
  const isLoan = (item: Item): item is Loan => "loanDate" in item;
  const isDonations = (item: Item): item is DonationsI => "donor" in item;
  const isDonors = (item: Item): item is DonorsI => "name" in item;

  return (
    <div className="item-table__desktop">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            {mode === "Donations" ? (
              <>
                <TableHead>Fecha de Donación</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Donador</TableHead>
              </>
            ) : mode === "Donors" ? (
              <>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
              </>
            ) : mode === "books" ? (
              <>
                <TableHead>Título</TableHead>
                <TableHead>Páginas</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Subcategoría</TableHead>
              </>
            ) : (
              <>
                <TableHead>ID Libro</TableHead>
                <TableHead>Libro</TableHead>
                <TableHead>
                  {mode === "loans" || mode === "loans-history"
                    ? "Fecha de Préstamo"
                    : "Fecha de Creación"}
                </TableHead>
                <TableHead>Fecha de Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Copia</TableHead>
              </>
            )}
            {mode !== "loans-history" && showActions && (
              <TableHead className="text-right">Acciones</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              {isDonations(item) ? (
                <>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.donor.name}</TableCell>
                </>
              ) : isDonors(item) ? (
                <>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                </>
              ) : isBook(item) ? (
                <>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.pages}</TableCell>
                  <TableCell>
                    {item.authors[0] ? item.authors[0].name : "Desconocido"}
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.subcategory}</TableCell>
                </>
              ) : (
                <>
                  <TableCell>{item.bookId || "N/A"}</TableCell>
                  <TableCell>{item.bookTitle || "Cargando..."}</TableCell>
                  <TableCell>
                    {new Date(
                      isLoan(item) ? item.loanDate : item.created
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(item.dueDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>{item.copies[0]?.code || "N/A"}</TableCell>
                </>
              )}
              {mode !== "loans-history" && showActions && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="item-table__dropdown-trigger"
                      >
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="item-table__dropdown-content"
                    >
                      {viewMode === "books" && isBook(item) && (
                        <>
                          {onEdit && (
                            <DropdownMenuItem
                              onClick={() => onEdit(item)}
                              className="item-table__dropdown-item mb-1"
                            >
                              Editar
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(item)}
                              className="item-table__dropdown-item"
                            >
                              Eliminar
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                      {viewMode === "catalog" && isBook(item) && onReserve && (
                        <DropdownMenuItem
                          onClick={() => onReserve(item)}
                          className="item-table__dropdown-item"
                        >
                          Reservar
                        </DropdownMenuItem>
                      )}
                      {viewMode === "loan" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onConvertToLoan(item)}
                            className="item-table__dropdown-item mb-1"
                          >
                            Convertir a préstamo
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onReservationStatus(item)}
                            className="item-table__dropdown-item"
                          >
                            Estado reserva
                          </DropdownMenuItem>
                        </>
                      )}
                      {viewMode === "loan-history" && (
                        <DropdownMenuItem
                          onClick={() => onLoanStatus(item)}
                          className="item-table__dropdown-item"
                        >
                          Estado préstamo
                        </DropdownMenuItem>
                      )}
                      {viewMode === "Donors" && (
                        <>
                          {onEditDonor && (
                            <DropdownMenuItem
                              onClick={() => onEditDonor(item)}
                              className="item-table__dropdown-item mb-1"
                            >
                              Editar
                            </DropdownMenuItem>
                          )}
                          {onDeleteDonor && (
                            <DropdownMenuItem
                              onClick={() => onDeleteDonor(item)}
                              className="item-table__dropdown-item"
                            >
                              Eliminar
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                      {viewMode === "Donations" && (
                        <>
                          {/* {onEditDonation && (
                                                        <DropdownMenuItem
                                                            onClick={() => onEditDonation(item)}
                                                            className="item-table__dropdown-item mb-1"
                                                        >
                                                            Editar
                                                        </DropdownMenuItem>
                                                    )} */}
                          {onDeleteDonation && (
                            <DropdownMenuItem
                              onClick={() => onDeleteDonation(item)}
                              className="item-table__dropdown-item"
                            >
                              Eliminar
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
