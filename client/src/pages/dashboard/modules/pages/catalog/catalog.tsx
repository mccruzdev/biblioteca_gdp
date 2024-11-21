import "./catalog.sass";
import { BookTable } from "../../components/book-table";

export function DashboardCatalog() {
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
    {
      id: 5,
      titulo: "Don Quijote de la Mancha",
      numPaginas: 863,
      autor: "Miguel de Cervantes",
      categoria: "Novela",
      subcategoria: "Clásico",
    },
    {
      id: 6,
      titulo: "Crimen y castigo",
      numPaginas: 671,
      autor: "Fiodor Dostoievski",
      categoria: "Novela",
      subcategoria: "Psicológica",
    },
    {
      id: 7,
      titulo: "Ulises",
      numPaginas: 730,
      autor: "James Joyce",
      categoria: "Novela",
      subcategoria: "Modernista",
    },
    {
      id: 8,
      titulo: "Matar a un ruiseñor",
      numPaginas: 281,
      autor: "Harper Lee",
      categoria: "Novela",
      subcategoria: "Ficción sureña",
    },
    {
      id: 9,
      titulo: "En busca del tiempo perdido",
      numPaginas: 4215,
      autor: "Marcel Proust",
      categoria: "Novela",
      subcategoria: "Modernista",
    },
    {
      id: 10,
      titulo: "Moby-Dick",
      numPaginas: 585,
      autor: "Herman Melville",
      categoria: "Novela",
      subcategoria: "Aventura",
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
          <BookTable books={books} showCatalog={true} />
        </div>
      </section>
    </>
  );
}
