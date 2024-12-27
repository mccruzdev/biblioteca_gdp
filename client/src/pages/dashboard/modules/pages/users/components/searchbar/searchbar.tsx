import { useState } from "react";
import { SelectFilter } from "./select-filter";
import { useUserDataUDC } from "@/context/data/data.hook";
import { FilterI } from "@/context/data/users.context.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRoleE, UserRoleT } from "@/types";

export function SearchBar() {
  const { filters } = useUserDataUDC();

  const [selectedFilter, setSelectedFilter] = useState<FilterI>(filters[0]);
  const [searchTerm, setSearchTerm] = useState<string | boolean>("");

  const changeFilter = (filter: FilterI) => {
    if (filter.value === "role") setSearchTerm(UserRoleE.READER);
    else setSearchTerm("");
    setSelectedFilter(filter);
  };

  const handleSearch = () => {
    selectedFilter.filter(searchTerm);
  };

  return (
    <div className="flex flex-col space-y-2 mb-4 sm:flex-row sm:space-y-0 sm:space-x-2">
      <SelectFilter
        filters={filters}
        selectedFilter={selectedFilter}
        changeFilter={changeFilter}
      />
      <div className="relative flex-grow">
        {selectedFilter.value === "emailverified" ? (
          <div className="flex items-center gap-3 h-full">
            <Checkbox onChange={(e) => setSearchTerm(e.target.checked)} />
            <p className="text-white">
              {searchTerm ? "Verificado" : "No verificado"}
            </p>
          </div>
        ) : selectedFilter.value === "isdisabled" ? (
          <div className="flex items-center gap-3 h-full">
            <Checkbox onChange={(e) => setSearchTerm(e.target.checked)} />
            <p className="text-white">
              {searchTerm ? "Desabilitado" : "Habilitado"}
            </p>
          </div>
        ) : selectedFilter.value === "role" ? (
          <Select
            value={searchTerm as string}
            onValueChange={(value: UserRoleT) => {
              setSearchTerm(value);
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
        ) : (
          <Input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm as string}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] border-[#3e3e40] text-[#C7C7CC] placeholder-[#6e6e6e] pr-8"
          />
        )}
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={handleSearch}
          className="flex-1 sm:flex-none bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/80"
        >
          <Search className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
      </div>
    </div>
  );
}
