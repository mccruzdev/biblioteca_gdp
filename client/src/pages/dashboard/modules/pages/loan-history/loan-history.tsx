import "./loan-history.sass";
import { useEffect, useState } from "react";
import { ItemTable } from "../../components/item-table";
import { PaginatedI, Loan } from "@/types";
import { fetchJSON } from "../../../../../services/fetch";
import { BACKEND_SERVER } from "../../../../../config/api";
import { useAuthUC, useTokenUC } from "../../../../../context/user/user.hook";
import { Toaster } from "../../../../../components/ui/toaster";
import { Button } from "../../../../../components/ui/button";

export function DashboardLoanHistory() {
  const { user } = useAuthUC();
  const { data: token } = useTokenUC();
  const [paginatedLoans, setPaginatedLoans] = useState<PaginatedI<Loan> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (token && user) {
      fetchLoans();
    }
  }, [token, user, currentPage, itemsPerPage]);

  const fetchLoans = async () => {
    if (!token || !user) return; // TODO: Redirect to login
    setIsLoading(true);

    try {
      const url =
        user.role === "READER"
          ? `${BACKEND_SERVER}/loan/me?page=${currentPage}&limit=${itemsPerPage}`
          : `${BACKEND_SERVER}/loan?page=${currentPage}&limit=${itemsPerPage}`;
      const { response, json } = await fetchJSON<PaginatedI<Loan>>(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setPaginatedLoans(json);
      } else {
        throw new Error("Failed to fetch loans");
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setIsLoading(false);
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
        <h1 className="text-2xl font-bold text-white mb-2">BIBLIOTECA</h1>
        <p className="text-gray-400">
          ¡Bienvenido! Explora y gestiona tus préstamos
        </p>
      </section>
      <div className="outer-container bg-secondary-bg rounded-lg p-4 md:p-6">
        <div className="inner-container bg-[#0e0e0e] rounded-lg p-4 md:p-6 mt-4">
          <section className="Catalog-content-section">
            <div className="border-b border-gray-100 py-1">
              <h2 className="text-xl font-bold text-white">
                Historial de Préstamos
              </h2>
            </div>
            <div className="pt-3">
              {isLoading ? (
                <p className="text-center text-gray-400">Cargando...</p>
              ) : paginatedLoans && paginatedLoans.data.length > 0 ? (
                <>
                  <ItemTable
                    items={paginatedLoans.data.map((loan) => ({
                      ...loan,
                      bookId: loan.copies[0]?.book.id,
                      bookTitle: loan.copies[0]?.book.title,
                    }))}
                    token={token || ""}
                    mode={user?.role === "READER" ? "loans-history" : "loans"}
                    viewMode="loan-history"
                    currentPage={paginatedLoans.currentPage}
                    totalPages={paginatedLoans.lastPage}
                    itemsPerPage={paginatedLoans.limit}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    prevPageUrl={paginatedLoans.prev}
                    nextPageUrl={paginatedLoans.next}
                    showActions={true}
                  />
                </>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">
                    No se encontraron préstamos.
                  </p>
                  <Button
                    onClick={fetchLoans}
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
