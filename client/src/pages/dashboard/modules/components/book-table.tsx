import React, { useState, useMemo } from "react";
import { Table, Button, Dropdown } from "flowbite-react";
import { MoreHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { BookI } from "../../../../types";

interface BookTableProps {
  books: BookI[];
}

export const BookTable: React.FC<BookTableProps> = ({ books }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookI | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(10);

  const handleReserve = (book: BookI) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = useMemo(() => books.slice(indexOfFirstBook, indexOfLastBook), [books, indexOfFirstBook, indexOfLastBook]);

  const totalPages = Math.ceil(books.length / booksPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg">
        <Table striped hoverable className="overflow-x-auto w-full text-sm text-left text-gray-200">
          <Table.Head className="text-xs uppercase !bg-black text-gray-200">
            <Table.HeadCell className="px-3 py-2 cursor-pointer !bg-black hover:!bg-yellow-500">Id</Table.HeadCell>
            <Table.HeadCell className="px-3 py-2 cursor-pointer !bg-black hover:!bg-yellow-500">Titulo</Table.HeadCell>
            <Table.HeadCell className="px-3 py-2 cursor-pointer !bg-black hover:!bg-yellow-500">Páginas</Table.HeadCell>
            <Table.HeadCell className="px-3 py-2 cursor-pointer !bg-black hover:!bg-yellow-500">Author</Table.HeadCell>
            <Table.HeadCell className="px-3 py-2 cursor-pointer !bg-black hover:!bg-yellow-500">Categoría</Table.HeadCell>
            <Table.HeadCell className="px-3 py-2 cursor-pointer !bg-black hover:!bg-yellow-500">Subcategoría</Table.HeadCell>
            <Table.HeadCell className="px-3 py-2 cursor-pointer !bg-black hover:!bg-yellow-500">Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {currentBooks.map((book) => (
              <Table.Row key={book.id} className="custom-bg hover:!bg-gray-700">
                <Table.Cell className="px-3 py-2 whitespace-nowrap">{book.id}</Table.Cell>
                <Table.Cell className="px-3 py-2 whitespace-nowrap">{book.title}</Table.Cell>
                <Table.Cell className="px-3 py-2 whitespace-nowrap">{book.pages}</Table.Cell>
                <Table.Cell className="px-3 py-2 whitespace-nowrap">
                  {book.authors[0] ? book.authors[0].name : "Desconocido"}
                </Table.Cell>
                <Table.Cell className="px-3 py-2 whitespace-nowrap">{book.category}</Table.Cell>
                <Table.Cell className="px-3 py-2 whitespace-nowrap">{book.subcategory}</Table.Cell>
                <Table.Cell className="px-3 py-2 whitespace-nowrap text-right">
                  <Dropdown
                    className="custom-bg"
                    label={<MoreHorizontal className="h-4 w-4" />}
                    dismissOnClick={false}
                    renderTrigger={() => (
                      <Button color="black" size="xs">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    )}
                  >
                    <Dropdown.Item
                      onClick={() => handleReserve(book)}
                      className="hover:bg-yellow-500"
                    >
                      Reservar
                    </Dropdown.Item>
                  </Dropdown>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className="flex items-center justify-end mt-4 space-x-2">
        <span className="text-sm text-gray-400 mr-2">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-2 py-1 text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-2 py-1 text-sm"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <select
          value={booksPerPage}
          onChange={(e) => {
            setBooksPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="bg-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="custom-bg rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">
                Realiza tu reserva
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Cerrar</span>
              </button>
            </div>
            {selectedBook && (
              <div className="p-4">
                <p className="text-sm text-gray-400">
                  ¿Deseas reservar el libro "{selectedBook.title}"?
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-3 p-4 border-t border-gray-700">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  console.log(`Reservando libro: ${selectedBook?.title}`);
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
              >
                Reservar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

