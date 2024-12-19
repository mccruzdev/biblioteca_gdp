import "./books.sass";
//import React from "react";
import { useEffect, useState, useRef } from "react";
import { BookI, PaginatedI } from "../../../../../types";
import { fetchJSON } from "../../../../../services/fetch";
import { BACKEND_SERVER } from "../../../../../config/api";
import { useAuthUC, useTokenUC } from "../../../../../context/user/user.hook";
import NewBook from "./new/button-new-book";
import { Toaster } from "../../../../../components/ui/toaster";
import { SearchBar } from "../../components/search-bar";
import { Button } from "../../../../../components/ui/button";
import { NotAuthorized } from "../../../../../components/not-authorized/not-authorized";
import { ItemTable } from "../../components/item-table";

export function DashboardBooks() {
  const { user } = useAuthUC();
  const { data: token } = useTokenUC();
  const [paginatedBooks, setPaginatedBooks] = useState<PaginatedI<BookI> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const searchBarRef = useRef<{ clearSearch: () => void }>(null);

  useEffect(() => {
    if (!user || user.role === "READER") return;
    if (token) fetchBooks();
  }, [user, token]);

  const fetchBooks = async (searchTerm?: string, searchType?: string) => {
    if (!token) return // TODO: Redirect to login
    setIsLoading(true)
    setIsSearching(!!searchTerm)

    let url = `${BACKEND_SERVER}/book?page=${currentPage}&limit=${itemsPerPage}`
    if (searchTerm && searchType) {
      url = `${BACKEND_SERVER}/search/books-by-${searchType}/${searchTerm}?page=${currentPage}&limit=${itemsPerPage}`
    }

    try {
      const { response, json } = await fetchJSON<PaginatedI<BookI>>(
        url,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        setPaginatedBooks(json)
      } else {
        throw new Error('Failed to fetch books')
      }
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (searchTerm: string, searchType: string) => {
    setCurrentPage(1)
    fetchBooks(searchTerm, searchType)
  }

  const handleReset = (clearSearchBar: boolean = false) => {
    setIsSearching(false)
    setCurrentPage(1) 
    fetchBooks()
    if (clearSearchBar) {
      searchBarRef.current?.clearSearch()
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) 
  }

  if (!user) return <p>Loading...</p>;
  if (user.role === "READER") return <NotAuthorized path="/dashboard" />;

  return (
    <div className="dashboard-catalog">
      <section className="mb-6 pt-2">
        <h1 className="text-2xl font-bold text-white mb-2">BIBLIOTECA</h1>
        <p className="text-gray-400">
          ¡Bienvenido! Aquí podrás Agregar, Editar y Eliminar los Libros.
        </p>
      </section>
      <div className="outer-container bg-secondary-bg rounded-lg p-6">
        <div className="mb-4 pt-2 pb-1 flex items-center justify-between flex-wrap gap-4">
          <div className="flex-grow">
            <SearchBar onSearch={handleSearch} onReset={() => handleReset(true)} ref={searchBarRef} />
          </div>
          <NewBook />
        </div>
        <div className="inner-container bg-[#0e0e0e] rounded-lg p-6">
          <section className="Catalog-content-section">
            <div className="border-b border-gray-100 py-1">
              <h2 className="text-xl font-bold text-white">Catálogo de Libros</h2>
            </div>
            <div className="pt-3">
              {isLoading ? (
                <p className="text-center text-gray-400">Cargando...</p>
              ) : paginatedBooks && paginatedBooks.data.length > 0 ? (
                <ItemTable
                  items={paginatedBooks.data}
                  token={token || ''}
                  mode="books"
                  viewMode="books"
                  currentPage={paginatedBooks.currentPage}
                  totalPages={paginatedBooks.lastPage}
                  itemsPerPage={paginatedBooks.limit}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  prevPageUrl={paginatedBooks.prev}
                  nextPageUrl={paginatedBooks.next}
                />
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">No se encontraron libros que coincidan con tu búsqueda.</p>
                  {isSearching && (
                    <Button onClick={() => handleReset(true)} className="bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/80">
                      Mostrar todos los libros
                    </Button>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

