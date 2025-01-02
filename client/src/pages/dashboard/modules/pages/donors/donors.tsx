import "./donors.sass";

import { useRef, useEffect, useState, useCallback } from "react";
import { DonorsI, PaginatedI } from "../../../../../types";
import { fetchJSON } from "../../../../../services/fetch";
import { BACKEND_SERVER } from "../../../../../config/api";
import { useAuthUC, useTokenUC } from "../../../../../context/user/user.hook";
// import { SearchBar } from "../../components/search-bar";
import { Toaster } from "../../../../../components/ui/toaster";
import { Button } from "../../../../../components/ui/button";
import { ItemTable } from "../../components/item-table";
import { NewDonor } from "./new/button-new-donor";
import { NotAuthorized } from "@/components/not-authorized/not-authorized";

export default function DashboardDonors() {
  const { user } = useAuthUC();
  const { data: token } = useTokenUC();
  const [paginatedDonors, setPaginatedDonors] =
    useState<PaginatedI<DonorsI> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const searchBarRef = useRef<{ clearSearch: () => void }>(null);

  const fetchDonors = useCallback(
    async (searchTerm?: string, searchType?: string) => {
      if (!token) return; // TODO: Redirect to login
      setIsLoading(true);
      setIsSearching(!!searchTerm);

      let url = `${BACKEND_SERVER}/donor?page=${currentPage}&limit=${itemsPerPage}`;
      if (searchTerm && searchType) {
        url = `${BACKEND_SERVER}/search/donor-by-${searchType}/${searchTerm}?page=${currentPage}&limit=${itemsPerPage}`;
      }

      try {
        const { response, json } = await fetchJSON<PaginatedI<DonorsI>>(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setPaginatedDonors(json);
        } else {
          throw new Error("Failed to fetch books");
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [token, currentPage, itemsPerPage]
  );

  const handleReset = (clearSearchBar: boolean = false) => {
    setIsSearching(false);
    setCurrentPage(1);
    fetchDonors();
    if (clearSearchBar) {
      searchBarRef.current?.clearSearch();
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (token && user && user.role !== "READER") {
      fetchDonors();
    }
  }, [token, user, fetchDonors]);

  if (!user) return <p>Loading...</p>;
  if (user.role === "READER") return <NotAuthorized path="/dashboard" />;

  return (
    <div className="dashboard-catalog">
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DONADORES</h1>
        <p className="text-gray-400">
          ¡Bienvenido! Aquí podrás registrar a los Donadores.
        </p>
      </section>
      <div className="outer-container bg-secondary-bg rounded-lg p-4 md:p-6">
        {/* <SearchBar onSearch={handleSearch} onReset={() => handleReset(true)} ref={searchBarRef} /> */}
        <NewDonor />
        <div className="inner-container bg-[#0e0e0e] rounded-lg p-4 md:p-6 mt-4">
          <section className="Catalog-content-section">
            <div className="border-b border-gray-100 py-1">
              <h2 className="text-xl font-bold text-white">Donadores</h2>
            </div>
            <div className="pt-3">
              {isLoading ? (
                <p className="text-center text-gray-400">Cargando...</p>
              ) : paginatedDonors && paginatedDonors.data.length > 0 ? (
                <ItemTable
                  items={paginatedDonors.data}
                  token={token || ""}
                  mode="Donors"
                  viewMode="Donors"
                  currentPage={paginatedDonors.currentPage}
                  totalPages={paginatedDonors.lastPage}
                  itemsPerPage={paginatedDonors.limit}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  prevPageUrl={paginatedDonors.prev}
                  nextPageUrl={paginatedDonors.next}
                  showActions={true}
                />
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">
                    No se encontraron Donadores que coincidan con tu búsqueda.
                  </p>
                  {isSearching && (
                    <Button
                      onClick={() => handleReset(true)}
                      className="bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/80"
                    >
                      Mostrar todos los Donadores
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
  );
}
