import React, { useState } from 'react';
import 'flowbite';
import "./add-books.sass";
import { BookTable } from "../../components/book-table";

export function DashboardAddBook() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    titulo: '',
    numPaginas: 0,
    autor: '',
    categoria: '',
    subcategoria: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar el nuevo libro a la base de datos
    console.log(newBook);
    setIsModalOpen(false); // Cerrar el modal después de agregar
  };

  const books = [
    {
      id: 1,
      titulo: "El gran Gatsby",
      numPaginas: 180,
      autor: "F. Scott Fitzgerald",
      categoria: "Novela",
      subcategoria: "Clásico",
    },
    {
      id: 2,
      titulo: "Cien años de soledad",
      numPaginas: 417,
      autor: "Gabriel García Márquez",
      categoria: "Novela",
      subcategoria: "Realismo mágico",
    },
    {
      id: 3,
      titulo: "1984",
      numPaginas: 328,
      autor: "George Orwell",
      categoria: "Novela",
      subcategoria: "Distopía",
    },
    {
      id: 4,
      titulo: "Orgullo y prejuicio",
      numPaginas: 432,
      autor: "Jane Austen",
      categoria: "Novela",
      subcategoria: "Romance",
    },
  ];

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
          <BookTable books={books} showAddBooks={true} />
        </div>  
        <div className="flex justify-end">
          <button
            className="px-4 py-2 custom-bg text-white text-sm rounded hover:bg-yellow-500 border border-gray-500"
            onClick={() => setIsModalOpen(true)}
          >
            Agregar
          </button>
        </div>
      </section>

      {/* Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isModalOpen ? '' : 'hidden'}`}
      >
        <div className="custom-bg rounded-lg shadow-lg max-w-md w-full mx-4 p-4">
          <h2 className="text-xl text-gray-300 font-semibold mb-4">Agregar Libro</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="titulo"
              placeholder="Título"
              value={newBook.titulo}
              onChange={handleInputChange}
              required
              className="mb-2 p-2 w-full border border-gray-300 rounded"
            />
            <input
              type="number"
              name="numPaginas"
              placeholder="Número de Páginas"
              value={newBook.numPaginas}
              onChange={handleInputChange}
              required
              className="mb-2 p-2 w-full border border-gray-300 rounded"
            />
            <input
              type="text"
              name="autor"
              placeholder="Autor"
              value={newBook.autor}
              onChange={handleInputChange}
              required
              className="mb-2 p-2 w-full border border-gray-300 rounded"
            />
            <input
              type="text"
              name="categoria"
              placeholder="Categoría"
              value={newBook.categoria}
              onChange={handleInputChange}
              required
              className="mb-2 p-2 w-full border border-gray-300 rounded"
            />
            <input
              type="text"
              name="subcategoria"
              placeholder="Subcategoría"
              value={newBook.subcategoria}
              onChange={handleInputChange}
              required
              className="mb-2 p-2 w-full border border-gray-300 rounded"
            />
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Agregar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}



