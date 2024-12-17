import "./loan.sass";
import { useEffect, useState } from "react";
import { BACKEND_SERVER } from "../../../../../config/api";
import { fetchJSON } from "../../../../../services/fetch";
import { useTokenUC } from "../../../../../context/user/user.hook";
import { ReservationTable } from "../../components/reserve-table";
import { Toaster } from "../../../../../components/ui/toaster";
import { LoanConfirmationModal } from "./loan/loan-book-modal";
import { loanApi, Copy } from "./loan.api";

interface Reservation {
  id: number;
  created: string;
  dueDate: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  copies: Copy[];
  bookTitle?: string;
  bookId?: number;
}

interface PaginatedResponse {
  data: Reservation[];
  total: number;
  lastPage: number;
  currentPage: number;
  limit: number;
}

export function DashboardLoan() {
  const { data: token } = useTokenUC()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  useEffect(() => {
    if (token) {
      fetchReservations(currentPage)
    }
  }, [token, currentPage])

  const fetchReservations = async (page: number) => {
    if (!token) return // TODO: Redirect to login
    setIsLoading(true)
    try {
      const { response, json } = await fetchJSON<PaginatedResponse>(
        `${BACKEND_SERVER}/reservation?page=${page}&limit=10`,
        { authorization: token }
      )

      if (response.ok) {
        setReservations(json.data)
        setTotalPages(json.lastPage)
        fetchBookDetails(json.data)
      } else {
        throw new Error('Failed to fetch reservations')
      }
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBookDetails = async (reservationsData: Reservation[]) => {
    const updatedReservations = await Promise.all(
      reservationsData.map(async (reservation) => {
        const copyId = reservation.copies[0]?.id
        if (copyId) {
          try {
            const result = await fetchJSON<{ title: string; id: number }>(
              `${BACKEND_SERVER}/book/${copyId}`,
              { authorization: token as string | undefined }
            ) as { response: Response; json: { title: string; id: number } };

            const { response, json } = result;
            if (response.ok) {
              const copies = await loanApi.getCopies(json.id, token as string);
              return { ...reservation, bookTitle: json.title, bookId: json.id, copies };
            }
          } catch (error) {
            console.error(`Error fetching book details for copy ${copyId}:`, error)
          }
        }
        return reservation
      })
    )
    setReservations(updatedReservations)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleLoanConfirmation = (reservation: Reservation) => {
    setSelectedReservation(reservation)
  }

  const handleLoanSuccess = () => {
    fetchReservations(currentPage)
  }

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
              ) : (
                <ReservationTable
                  reservations={reservations}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  onLoan={handleLoanConfirmation}
                />
              )}
            </div>
          </section>
        </div>
      </div>
      {selectedReservation && token && (
        <LoanConfirmationModal
          isOpen={!!selectedReservation}
          onClose={() => setSelectedReservation(null)}
          reservation={selectedReservation}
          token={token}
          onSuccess={handleLoanSuccess}
        />
      )}
      <Toaster />
    </div>
  )
}

