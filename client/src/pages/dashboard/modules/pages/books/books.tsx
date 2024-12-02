import "./books.sass";
//import React from "react";
import { BookTable } from "../../components/addbooks";
import { useEffect, useState } from "react";
import { BookI, PaginatedI } from "../../../../../types";
import { fetchJSON } from "../../../../../services/fetch";
import { BACKEND_SERVER } from "../../../../../config/api";
import { useTokenUC } from "../../../../../context/user/user.hook";
import { BookTableCrud } from "./components/book-table-crud";

export function DashboardBooks() {
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
          {paginatedBooks && <BookTableCrud books={paginatedBooks?.data} />}
        </div>
      </section>
    </>
  );
}


/*
  const deleteBook = async (bookId: string) => {
    if (!data) return; // Asegúrate de que el usuario esté autenticado

    const { response } = await fetchJSON(
      `${BACKEND_SERVER}/book/${bookId}`,
      {
        method: 'DELETE',
        authorization: data,
      }
    );

    if (response.ok) {
      // Actualiza el estado para eliminar el libro de la lista
      setPaginatedBooks((prevBooks) => {
        if (!prevBooks) return null; // Si no hay libros, retorna null
        return {
          ...prevBooks,
          data: prevBooks.data.filter(book => book.id !== Number(bookId)), // Convert bookId to number
        };
      });
    } else {
      // Manejo de errores (opcional)
      console.error('Error al eliminar el libro');
    }
  };
*/
