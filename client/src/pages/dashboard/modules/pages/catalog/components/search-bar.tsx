import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../../../../../../components/ui/input';
import { Button } from '../../../../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select";

interface SearchBarProps {
    onSearch: (searchTerm: string, searchType: string) => void;
    onReset: () => void;
}

export function SearchBar({ onSearch, onReset }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('title');

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            onReset();
        } else {
            onSearch(searchTerm, searchType);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        onReset();
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex space-x-2 mb-4">
            <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-[180px] bg-[#141414] border-[#3e3e40] text-[#C7C7CC]">
                    <SelectValue placeholder="Buscar por..." />
                </SelectTrigger>
                <SelectContent className="bg-[#0e0e0e] border-[#3e3e40]">
                    <SelectItem value="title" className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]">Título</SelectItem>
                    <SelectItem value="author" className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]">Autor</SelectItem>
                    <SelectItem value="category" className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]">Categoría</SelectItem>
                    <SelectItem value="subcategory" className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]">Subcategoría</SelectItem>
                </SelectContent>
            </Select>
            <div className="relative flex-grow">
                <Input
                    type="text"
                    placeholder="Buscar libros..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-grow bg-[#141414] border-[#3e3e40] text-[#C7C7CC] placeholder-[#6e6e6e] pr-8"
                />
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#6e6e6e] hover:text-[#FFBC24]"
                        type="button"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            <Button onClick={handleSearch} className="bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/80">
                <Search className="h-4 w-4 mr-2" />
                Buscar
            </Button>
            <Button onClick={onReset} className="bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/80">
                Mostrar todos
            </Button>
        </div>
    );
}

