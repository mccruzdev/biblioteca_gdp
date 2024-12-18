import { useState } from "react";
import { ItemTable } from "../../components/item-table";
import { Reservation } from "@/types";

const mockReservations: Reservation[] = [
  {
    id: 1,
    created: '2023-05-01',
    dueDate: '2023-05-15',
    status: 'PENDING',
    copies: [{ id: 1, code: 'GG001', condition: 'Good' }],
    bookTitle: 'The Great Gatsby',
    bookId: 101
  },
  {
    id: 2,
    created: '2023-05-10',
    dueDate: '2023-05-24',
    status: 'PENDING',
    copies: [{ id: 2, code: 'TKM001', condition: 'Excellent' }],
    bookTitle: 'To Kill a Mockingbird',
    bookId: 102
  },
  {
    id: 3,
    created: '2023-05-20',
    dueDate: '2023-06-03',
    status: 'PENDING',
    copies: [{ id: 3, code: '1984001', condition: 'Fair' }],
    bookTitle: '1984',
    bookId: 103
  }
];

export function DashboardLoan() {
  const [reservations] = useState<Reservation[]>(mockReservations);

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
              <ItemTable
                items={reservations}
                token="mock-token"
                mode="reservations"
                viewMode="loan"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

