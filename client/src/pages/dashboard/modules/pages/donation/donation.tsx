import "./donation.sass";

import { useRef, useEffect, useState } from "react";
import { DonationsI, PaginatedI } from "../../../../../types";
import { fetchJSON } from "../../../../../services/fetch";
import { BACKEND_SERVER } from "../../../../../config/api";
import { useTokenUC } from "../../../../../context/user/user.hook";
// import { SearchBar } from "../../components/search-bar";
import { Toaster } from "../../../../../components/ui/toaster";
import { Button } from "../../../../../components/ui/button";
import { ItemTable } from "../../components/item-table";
import { NewDonation } from "./new/button-new-donation";

export function DashboardDonation() {
  const { data: token } = useTokenUC();
  const [paginatedDonations, setPaginatedDonations] =
    useState<PaginatedI<DonationsI> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const searchBarRef = useRef<{ clearSearch: () => void }>(null);

  useEffect(() => {
    if (token) {
      fetchDonations();
    }
  }, [token, currentPage, itemsPerPage]);

  const fetchDonations = async (searchTerm?: string, searchType?: string) => {
    if (!token) return; // TODO: Redirect to login
    setIsLoading(true);
    setIsSearching(!!searchTerm);

    let url = `${BACKEND_SERVER}/donation?page=${currentPage}&limit=${itemsPerPage}`;
    if (searchTerm && searchType) {
      url = `${BACKEND_SERVER}/search/donation-by-${searchType}/${searchTerm}?page=${currentPage}&limit=${itemsPerPage}`;
    }

    try {
      const { response, json } = await fetchJSON<PaginatedI<DonationsI>>(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setPaginatedDonations(json);
      } else {
        throw new Error("Failed to fetch donations");
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSearch = (searchTerm: string, searchType: string) => {
  //   setCurrentPage(1)
  //   fetchDonors(searchTerm, searchType)
  // }

  const handleReset = (clearSearchBar: boolean = false) => {
    setIsSearching(false);
    setCurrentPage(1);
    fetchDonations();
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

  return (
    <div className="dashboard-catalog">
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">DONACIONES</h1>
        <p className="text-gray-400">
          ¡Bienvenido! Aquí podrás registrar a las Donaciones.
        </p>
      </section>
      <div className="outer-container bg-secondary-bg rounded-lg p-4 md:p-6">
        {/* <SearchBar onSearch={handleSearch} onReset={() => handleReset(true)} ref={searchBarRef} /> */}
        <NewDonation />
        <div className="inner-container bg-[#0e0e0e] rounded-lg p-4 md:p-6 mt-4">
          <section className="Catalog-content-section">
            <div className="border-b border-gray-100 py-1">
              <h2 className="text-xl font-bold text-white">Donaciones</h2>
            </div>
            <div className="pt-3">
              {isLoading ? (
                <p className="text-center text-gray-400">Cargando...</p>
              ) : paginatedDonations && paginatedDonations.data.length > 0 ? (
                <ItemTable
                  items={paginatedDonations.data}
                  token={token || ""}
                  mode="Donations"
                  viewMode="Donations"
                  currentPage={paginatedDonations.currentPage}
                  totalPages={paginatedDonations.lastPage}
                  itemsPerPage={paginatedDonations.limit}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  prevPageUrl={paginatedDonations.prev}
                  nextPageUrl={paginatedDonations.next}
                  showActions={true}
                />
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">
                    No se encontraron Donaciones que coincidan con tu búsqueda.
                  </p>
                  {isSearching && (
                    <Button
                      onClick={() => handleReset(true)}
                      className="bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/80"
                    >
                      Mostrar todas las Donaciones
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
