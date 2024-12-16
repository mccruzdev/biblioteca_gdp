import { useState, forwardRef, useImperativeHandle } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";

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
        <div className="search-bar__container">
            <div className="search-bar__input-container">
                <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger className="search-bar__select search-bar__select-trigger">
                        <SelectValue placeholder="Buscar por..." />
                    </SelectTrigger>
                    <SelectContent className="search-bar__select-content">
                        <SelectItem value="title" className="search-bar__select-item">Título</SelectItem>
                        <SelectItem value="author" className="search-bar__select-item">Autor</SelectItem>
                        <SelectItem value="category" className="search-bar__select-item">Categoría</SelectItem>
                        <SelectItem value="subcategory" className="search-bar__select-item">Subcategoría</SelectItem>
                    </SelectContent>
                </Select>
                <div className="search-bar__input-wrapper">
                    <Input
                        type="text"
                        placeholder="Buscar libros..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="search-bar__input"
                    />
                    {searchTerm && (
                        <button
                            onClick={handleClear}
                            className="search-bar__clear-button"
                            type="button"
                        >
                            <X className="search-bar__icon" />
                        </button>
                    )}
                </div>
            </div>
            <div className="search-bar__buttons">
                <Button onClick={handleSearch} className="search-bar__button search-bar__button--search">
                    <Search className="search-bar__icon" />
                    Buscar
                </Button>
                <Button onClick={handleClear} className="search-bar__button search-bar__button--reset">
                    Mostrar todos
                </Button>
            </div>
        </div>
    );
});

SearchBar.displayName = 'SearchBar';

