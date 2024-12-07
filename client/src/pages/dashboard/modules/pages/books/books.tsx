import "./books.sass";
//import React from "react";
import { useEffect, useState } from "react";
import { BookI, PaginatedI } from "../../../../../types";
import { fetchJSON } from "../../../../../services/fetch";
import { BACKEND_SERVER } from "../../../../../config/api";
import { useAuthUC, useTokenUC } from "../../../../../context/user/user.hook";
import { BookTableCrud } from "./components/book-table-crud";
import NewBook from "../books/new/button-book";
import { Toaster } from "../../../../../components/ui/toaster";
import { NotAuthorized } from "../../../../../components/not-authorized/not-authorized";

export function DashboardBooks() {
  const { user } = useAuthUC();
  const { data } = useTokenUC();
  const [paginatedBooks, setPaginatedBooks] =
    useState<PaginatedI<BookI> | null>(null);

  useEffect(() => {
    if (user?.role === "READER") return;

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
  }, [user, data]);

  if (!user) return <p>Loading...</p>;
  if (user.role === "READER") return <NotAuthorized path="/dashboard" />;

  return (
    <>
      <div className="dashboard-catalog">
        <section className="mb-6 pt-2">
          <h1 className="text-2xl font-bold text-white mb-2">BIBLIOTECA</h1>
          <p className="text-gray-400">
            ¡Bienvenido! Aquí podrás Agregar, Editar y Eliminar los Libros.
          </p>
        </section>
        <div className="outer-container bg-secondary-bg rounded-lg p-6">
          <div className="mb-4 pt-2 pb-1 flex justify-between ">
            <p className="text-white mb-4">Buscar</p>
            <NewBook />
          </div>
          <div className="inner-container bg-[#0e0e0e] rounded-lg p-6">
            <section className="Catalog-content-section">
              <div className="border-b border-gray-100 py-1">
                <h2 className="text-xl font-bold text-white">
                  Catálogo de Libros
                </h2>
              </div>
              <div className="pt-3">
                {paginatedBooks && (
                  <BookTableCrud
                    books={paginatedBooks.data}
                    token={data || ""}
                  />
                )}
              </div>
            </section>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
}
