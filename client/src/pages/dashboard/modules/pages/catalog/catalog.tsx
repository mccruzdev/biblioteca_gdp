import "./catalog.sass";
import { useEffect, useState } from "react";
import { BookI, PaginatedI } from "../../../../../types";
import { fetchJSON } from "../../../../../services/fetch";
import { BACKEND_SERVER } from "../../../../../config/api";
import { useTokenUC } from "../../../../../context/user/user.hook";
import { BookTable } from "./components/book-table";
//import { BookTable } from "../../components/book-table";

export function DashboardCatalog() {
  const { data } = useTokenUC();
  const [paginatedBooks, setPaginatedBooks] =
    useState<PaginatedI<BookI> | null>(null);

  useEffect(() => {
    (async () => {
      if (!data) return; // TODO: Redirect to login
      const { response, json } = await fetchJSON<PaginatedI<BookI>>(
        `${BACKEND_SERVER}/book`,
        { authorization: data }
      );

      if (response.ok) {
        setPaginatedBooks(json);
      }
    })();
  }, [data]);

  return (
    <>
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">BIBLIOTECA</h1>
        <p className="text-gray-400">
          ¡Bienvenido! Explora y reserva tus libros favoritos
        </p>
      </section>
      <section className="Catalog-content-section">
        <div className="border-b border-gray-100 py-1">
          <h2 className="text-xl font-bold text-white">Catálogo de Libros</h2>
        </div>
        <div className="pt-3">
          {paginatedBooks && <BookTable books={paginatedBooks?.data} />}*
        </div>
      </section>
    </>
  );
}
