import { useState, forwardRef, useImperativeHandle } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../../../../../../components/ui/input';
import { Button } from '../../../../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select";

interface SearchBarProps {
    onSearch: (searchTerm: string, searchType: string) => void;
    onReset: () => void;
}

export const SearchBar = forwardRef<{ clearSearch: () => void }, SearchBarProps>(({ onSearch, onReset }, ref) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('title');

    useImperativeHandle(ref, () => ({
        clearSearch: () => {
            setSearchTerm('');
            setSearchType('title');
        }
    }));

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
        <div className="flex flex-col space-y-2 mb-4 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-full sm:w-[180px] bg-[#141414] border-[#3e3e40] text-[#C7C7CC]">
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
                    className="w-full bg-[#141414] border-[#3e3e40] text-[#C7C7CC] placeholder-[#6e6e6e] pr-8"
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
            <div className="flex space-x-2">
                <Button onClick={handleSearch} className="flex-1 sm:flex-none bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/80">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                </Button>
                <Button onClick={handleClear} className="flex-1 sm:flex-none bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/80">
                    Mostrar todos
                </Button>
            </div>
        </div>
    );
});


