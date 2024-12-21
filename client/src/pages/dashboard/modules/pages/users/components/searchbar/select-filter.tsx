import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterI } from "@/context/data/users.context.hook";
import { SelectContent } from "@radix-ui/react-select";

interface Props {
  changeFilter: (filter: FilterI) => void;
  selectedFilter: FilterI;
  filters: FilterI[];
}

export function SelectFilter({ filters, selectedFilter, changeFilter }: Props) {
  return (
    <Select
      value={selectedFilter.value}
      onValueChange={(value: string) => {
        const filter = filters.filter((filter) => filter.value === value);
        if (filter.length > 0) {
          changeFilter(filter[0]);
        }
      }}
    >
      <SelectTrigger className="w-[180px] border-[#3e3e40] bg-[#0e0e0e] text-[#C7C7CC]">
        <SelectValue placeholder="Seleccionar filtro" />
      </SelectTrigger>
      <SelectContent className="bg-[#0e0e0e] border-[#3e3e40] w-[180px] z-50">
        {filters.map((filter) => (
          <SelectItem
            key={filter.value}
            value={filter.value}
            className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]"
          >
            {filter.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
