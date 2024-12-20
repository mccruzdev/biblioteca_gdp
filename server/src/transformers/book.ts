import { ParseBook } from 'src/types';

export const transformBook = (book: ParseBook) => {
  return {
    id: book.id,
    title: book.title,
    pages: book.pages,
    authors: book.authors.map((author: any) => ({
      id: author.id,
      name: author.name,
      email: author.email,
    })),
    subcategory: book.Subcategory?.name || null,
    category: book.Subcategory?.Category?.name || null,
  };
};

export const transformBooks = (books: ParseBook[]) => {
  return books.map((book) => transformBook(book));
};
