import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BACKEND_SERVER } from "@/config/api";
import { useUserDataUDC } from "@/context/data/data.hook";
import { useTokenUC } from "@/context/user/user.hook";
import { useToast } from "@/hooks/use-toast";
import { fetchJSON } from "@/services/fetch";
import { AllDataUserI, UserRoleE, UserRoleT } from "@/types";
import { useEffect, useState } from "react";

type UserAvailabilityT = "UNAVAILABLE" | "AVAILABLE";
enum UserAvailabilityE {
  UNAVAILABLE = "UNAVAILABLE",
  AVAILABLE = "AVAILABLE",
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: AllDataUserI;
}

export function ModalEditUser({ isOpen, onClose, user }: Props) {
  const { data } = useTokenUC();
  const { getUsers } = useUserDataUDC();
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    role: UserRoleT;
    availability: UserAvailabilityT;
  }>({
    role: user.role,
    availability: user.isDisabled ? "UNAVAILABLE" : "AVAILABLE",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmitEdit = async (e: any) => {
    e.preventDefault();

    onClose();

    const { response } = await fetchJSON(`${BACKEND_SERVER}/user/${user?.id}`, {
      method: "PUT",
      authorization: data,
      body: {
        role: formData?.role,
        isDisabled: formData?.availability === "UNAVAILABLE" ? true : false,
      },
      json: false,
    });

    if (response.ok) {
      toast({
        title: "Éxito",
        description: "El usuario ha sido editado correctamente",
      });
      await getUsers();
    } else {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al editar el usuario",
      });
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "auto";
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#0e0e0e] text-[#C7C7CC]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifica el rol e inabilita usuarios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmitEdit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Rol</Label>
              <Select
                value={formData?.role}
                onValueChange={(value: UserRoleT) => {
                  if (!formData) return;
                  setFormData({ ...formData, role: value });
                }}
              >
                <SelectTrigger className="w-[180px] border-[#3e3e40] bg-[#0e0e0e] text-[#C7C7CC]">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent className="bg-[#0e0e0e] border-[#3e3e40]">
                  <SelectItem
                    value={UserRoleE.READER}
                    className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]"
                  >
                    Lector
                  </SelectItem>
                  <SelectItem
                    value={UserRoleE.LIBRARIAN}
                    className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]"
                  >
                    Bibliotecario
                  </SelectItem>
                  <SelectItem
                    value={UserRoleE.ADMIN}
                    className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]"
                  >
                    Administrador
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Habilitado</Label>
              <Select
                value={formData?.availability}
                onValueChange={(value: UserAvailabilityT) => {
                  if (!formData) return;
                  setFormData({ ...formData, availability: value });
                }}
              >
                <SelectTrigger className="w-[180px] border-[#3e3e40] bg-[#0e0e0e] text-[#C7C7CC]">
                  <SelectValue placeholder="Seleccionar disponibilidad" />
                </SelectTrigger>
                <SelectContent className="bg-[#0e0e0e] border-[#3e3e40]">
                  <SelectItem
                    value={UserAvailabilityE.AVAILABLE}
                    className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]"
                  >
                    Habilitado
                  </SelectItem>
                  <SelectItem
                    value={UserAvailabilityE.UNAVAILABLE}
                    className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]"
                  >
                    No Habilitado
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#FFBC24] rounded-md hover:bg-[#FFBC24] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[#FFBC24]"
            >
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
