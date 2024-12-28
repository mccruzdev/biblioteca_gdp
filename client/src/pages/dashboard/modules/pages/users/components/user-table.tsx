import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AllDataUserI } from "@/types";
import { usePagination } from "../../../hooks/use-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModalEditUser } from "./modal/dialog-edit-user";

interface Props {
  users: AllDataUserI[];
}

export function UserTable({ users }: Props) {
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<AllDataUserI | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(true);

  const {
    currentPage,
    totalPages,
    currentItems: currentUsers,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(users, usersPerPage);

  const handleEdit = (user: AllDataUserI) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 7;
    let startPage, endPage;

    if (totalPages <= maxButtons) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= Math.ceil(maxButtons / 2)) {
      startPage = 1;
      endPage = maxButtons - 2;
    } else if (currentPage >= totalPages - Math.floor(maxButtons / 2)) {
      startPage = totalPages - maxButtons + 3;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor((maxButtons - 4) / 2);
      endPage = currentPage + Math.ceil((maxButtons - 4) / 2);
    }

    buttons.push(
      <Button
        key={1}
        variant={1 === currentPage ? "default" : "outline"}
        size="sm"
        onClick={() => goToPage(1)}
        className="px-3 py-2 bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90"
      >
        1
      </Button>
    );

    if (startPage > 2) {
      buttons.push(
        <span key="start-ellipsis" className="px-2 py-2">
          ...
        </span>
      );
    }

    for (
      let i = Math.max(2, startPage);
      i <= Math.min(endPage, totalPages - 1);
      i++
    ) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(i)}
          className={`px-3 py-2 ${
            i === currentPage
              ? "bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90"
              : "bg-[#141414] text-[#C7C7CC] hover:bg-[#141414] hover:text-[#FFBC24] hover:border-[#FFBC24]"
          }`}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages - 1) {
      buttons.push(
        <span key="end-ellipsis" className="px-2 py-2">
          ...
        </span>
      );
    }

    if (totalPages > 1) {
      buttons.push(
        <Button
          key={totalPages}
          variant={totalPages === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(totalPages)}
          className="px-3 py-2 bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/90"
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <>
      <div className="hidden md:block rounded-lg border border-[#3e3e40] bg-[#0e0e0e] p-4">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#3e3e40]">
              <TableHead className="w-[100px] text-[#C7C7CC]">Id</TableHead>
              <TableHead className="text-[#C7C7CC]">DNI</TableHead>
              <TableHead className="text-[#C7C7CC]">Nombres</TableHead>
              <TableHead className="text-[#C7C7CC]">Apellidos</TableHead>
              <TableHead className="text-[#C7C7CC]">Celular</TableHead>
              <TableHead className="text-[#C7C7CC]">Rol</TableHead>
              <TableHead className="text-[#C7C7CC]">Correo</TableHead>
              <TableHead className="text-[#C7C7CC]">Verificado</TableHead>
              <TableHead className="text-[#C7C7CC]">Habilitado</TableHead>
              <TableHead className="text-right text-[#C7C7CC]">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user, index) => (
              <TableRow key={index} className="border-b-[#3e3e40]">
                <TableCell className="font-medium text-[#C7C7CC]">
                  {index + 1}
                </TableCell>
                <TableCell className="text-[#C7C7CC]">{user.dni}</TableCell>
                <TableCell className="text-[#C7C7CC]">{user.names}</TableCell>
                <TableCell className="text-[#C7C7CC]">
                  {user.lastName}
                </TableCell>
                <TableCell className="text-[#C7C7CC]">
                  {user.phoneNumber}
                </TableCell>
                <TableCell className="text-[#C7C7CC]">
                  {user.role === "ADMIN"
                    ? "Administrador"
                    : user.role === "LIBRARIAN"
                    ? "Bibliotecario"
                    : "Lector"}
                </TableCell>
                <TableCell className="text-[#C7C7CC]">{user.email}</TableCell>
                <TableCell className="text-[#C7C7CC]">
                  {user.emailVerified ? "✅" : null}
                </TableCell>
                <TableCell className="text-[#C7C7CC]">
                  {user.isDisabled ? "❌" : "✅"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-[#C7C7CC] hover:bg-[#141414] hover:text-[#FFBC24]"
                      >
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-[#0e0e0e] border-[#3e3e40]"
                    >
                      <DropdownMenuItem
                        onClick={() => handleEdit(user)}
                        className="cursor-pointer bg-[#FFBC24] text-[#010101] hover:opacity-70 focus:bg-[#FFBC24] focus:text-[#010101] mb-1"
                      >
                        Editar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 space-x-0 sm:space-x-2 py-4">
        <div className="flex-1 text-sm text-[#C7C7CC]">
          Página {currentPage} de {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-2 py-2 bg-[#141414] text-[#C7C7CC] hover:bg-[#141414] hover:text-[#FFBC24] hover:border-[#FFBC24] border-[#3e3e40]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {renderPaginationButtons()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-2 py-2 bg-[#141414] text-[#C7C7CC] hover:bg-[#141414] hover:text-[#FFBC24] hover:border-[#FFBC24] border-[#3e3e40]"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Select
          value={usersPerPage.toString()}
          onValueChange={(value) => {
            setUsersPerPage(Number(value));
            goToPage(1);
          }}
        >
          <SelectTrigger className="w-[180px] border-[#3e3e40] bg-[#0e0e0e] text-[#C7C7CC]">
            <SelectValue placeholder="Seleccionar filas por página" />
          </SelectTrigger>
          <SelectContent className="bg-[#0e0e0e] border-[#3e3e40]">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem
                key={pageSize}
                value={pageSize.toString()}
                className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]"
              >
                Mostrar {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedUser && isEditModalOpen ? (
        <ModalEditUser
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={selectedUser}
        />
      ) : null}
    </>
  );
}