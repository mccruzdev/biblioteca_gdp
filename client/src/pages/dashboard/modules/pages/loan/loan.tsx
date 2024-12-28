import "./loan.sass";
import { useCallback, useEffect, useState } from "react";
import { ItemTable } from "../../components/item-table";
import { Reservation, PaginatedI } from "@/types";
import { fetchJSON } from "../../../../../services/fetch";
import { BACKEND_SERVER } from "../../../../../config/api";
import { useAuthUC, useTokenUC } from "../../../../../context/user/user.hook";
import { Toaster } from "../../../../../components/ui/toaster";
import { Button } from "../../../../../components/ui/button";

export default function DashboardLoan() {
  const { data: token } = useTokenUC();
  const { user } = useAuthUC();
  const [paginatedReservations, setPaginatedReservations] =
    useState<PaginatedI<Reservation> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchReservations = useCallback(async () => {
    if (!token) return; // TODO: Redirect to login
    setIsLoading(true);

    try {
      const url =
        user?.role !== "ADMIN"
          ? `${BACKEND_SERVER}/reservation/me?page=${currentPage}&limit=${itemsPerPage}`
          : `${BACKEND_SERVER}/reservation?page=${currentPage}&limit=${itemsPerPage}`;
      const { response, json } = await fetchJSON<PaginatedI<Reservation>>(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setPaginatedReservations(json);
      } else {
        throw new Error("Failed to fetch reservations");
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, token, user]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  useEffect(() => {
    if (token) {
      fetchReservations();
    }
  }, [token, fetchReservations]);

  return (
    <div className="dashboard-catalog">
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">BIBLIOTECA</h1>
        <p className="text-gray-400">
          ¡Bienvenido! Explora y gestiona tus reservas
        </p>
      </section>
      <div className="outer-container bg-secondary-bg rounded-lg p-4 md:p-6">
        <div className="inner-container bg-[#0e0e0e] rounded-lg p-4 md:p-6 mt-4">
          <section className="Catalog-content-section">
            <div className="border-b border-gray-100 py-1">
              <h2 className="text-xl font-bold text-white">Reservas</h2>
            </div>
            <div className="pt-3">
              {isLoading ? (
                <p className="text-center text-gray-400">Cargando...</p>
              ) : paginatedReservations &&
                paginatedReservations.data.length > 0 ? (
                <>
                  <ItemTable
                    items={paginatedReservations.data.map((reservation) => ({
                      ...reservation,
                      bookId: reservation.copies[0]?.book.id,
                      bookTitle: reservation.copies[0]?.book.title,
                    }))}
                    token={token || ""}
                    mode="reservations"
                    viewMode="loan"
                    currentPage={paginatedReservations.currentPage}
                    totalPages={paginatedReservations.lastPage}
                    itemsPerPage={paginatedReservations.limit}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    prevPageUrl={paginatedReservations.prev}
                    nextPageUrl={paginatedReservations.next}
                    showActions={user?.role !== "READER"}
                  />
                </>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">
                    No se encontraron reservas.
                  </p>
                  <Button
                    onClick={fetchReservations}
                    className="bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/80"
                  >
                    Recargar reservas
                  </Button>
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
