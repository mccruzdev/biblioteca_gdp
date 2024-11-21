import React, { useState } from "react";
import { Table, Button, Dropdown } from "flowbite-react";
import { MoreHorizontal, X } from "lucide-react";
import { BookI } from "../../../../types";

interface BookTableProps {
    books: BookI[];
}

export const BookTable: React.FC<BookTableProps> = ({ books }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<BookI | null>(null);
    const [modalAction, setModalAction] = useState<'delete' | 'edit' | null>(null);

    const handleEdit = (book: BookI) => {
        setSelectedBook(book);
        setModalAction('edit');
        setIsModalOpen(true);
    };

    const handleDelete = (book: BookI) => {
        setSelectedBook(book);
        setModalAction('delete');
        setIsModalOpen(true);
        //deleteBook(bookId);
    };

    const openModal = (action: 'delete' | 'edit') => {
        setModalAction(action);
        setIsModalOpen(true);
    };

    return (
        <>
            <div
                className="overflow-x-auto rounded-lg" /*Borde gris claro alrededor de la tabla*/
            >
                <Table
                    striped
                    hoverable
                    className="overflow-x-auto w-full text-sm text-left text-gray-200" /*Texto gris claro en modo claro y gris claro en modo oscuro*/
                >
                    <Table.Head className="text-xs uppercase !bg-black text-gray-200">
                        <THeadCell label="Id" />
                        <THeadCell label="Titulo" />
                        <THeadCell label="Páginas" />
                        <THeadCell label="Author" />
                        <THeadCell label="Categoría" />
                        <THeadCell label="Subcategoría" />
                        <THeadCell label="Acciones" />
                    </Table.Head>
                    <Table.Body>
                        {books.map((book) => (
                            <Table.Row
                                key={book.id}
                                className="custom-bg hover:!bg-" // Fondo gris medio para las filas, cambia a gris oscuro al pasar el mouse
                            >
                                <Table.Cell className="px-3 py-2 whitespace-nowrap">
                                    {book.id}
                                </Table.Cell>
                                <Table.Cell className="px-3 py-2 whitespace-nowrap">
                                    {book.title}
                                </Table.Cell>
                                <Table.Cell className="px-3 py-2 whitespace-nowrap">
                                    {book.pages}
                                </Table.Cell>
                                <Table.Cell className="px-3 py-2 whitespace-nowrap">
                                    {book.authors[0] ? book.authors[0].name : "Desconocido"}
                                </Table.Cell>
                                <Table.Cell className="px-3 py-2 whitespace-nowrap">
                                    {book.category}
                                </Table.Cell>
                                <Table.Cell className="px-3 py-2 whitespace-nowrap">
                                    {book.subcategory}
                                </Table.Cell>
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
                                            onClick={() => handleEdit(book)}
                                            className="hover:bg-yellow-500"
                                        >
                                            Editar
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => handleDelete(book)}
                                            className="hover:bg-yellow-500"
                                        >
                                            Eliminar
                                        </Dropdown.Item>
                                        
                                    </Dropdown>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="custom-bg rounded-lg shadow-lg max-w-md w-full mx-4">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 className="text-xl font-semibold text-white">
                                {modalAction === 'delete' ? 'Eliminar Libro' : 'Editar Libro'}
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
                                {modalAction === 'delete' ? (
                                    <p className="text-sm text-gray-400">
                                        ¿Estás seguro de que deseas eliminar el libro "{selectedBook.title}"?
                                    </p>
                                ) : (
                                    <div>
                                        <p className="text-sm text-gray-400">
                                            Editar detalles del libro "{selectedBook.title}".
                                        </p>
                                        <input
                                            type="text"
                                            defaultValue={selectedBook.title}
                                            className="mt-2 p-2 w-full bg-gray-800 text-white rounded-md"
                                        />
                                    </div>
                                )}
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
                                    if (modalAction === 'delete') {
                                        console.log(`Eliminando libro: ${selectedBook?.title}`);
                                        // Aquí puedes llamar a la función de eliminación
                                    } else {
                                        console.log(`Editando libro: ${selectedBook?.title}`);
                                        // Aquí puedes manejar la lógica de edición
                                    }
                                    setIsModalOpen(false);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
                            >
                                {modalAction === 'delete' ? 'Eliminar' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

function THeadCell({ label }: { label: string }) {
    return (
        <Table.HeadCell
            className="px-3 py-2 cursor-pointer !bg-black hover:!bg-yellow-500" // Fondo gris oscuro al pasar el mouse sobre las celdas del encabezado
        >
            <div className="flex items-center">{label}</div>
        </Table.HeadCell>
    );
}
