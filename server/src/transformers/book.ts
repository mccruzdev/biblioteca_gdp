import { ParseBook, ParseBookWithCopies } from 'src/types';
import { transformCopyArray } from './copy';

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

export const transformBookWithCopies = (book: ParseBookWithCopies) => {
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
    copies: transformCopyArray(book.copies),
  };
};

export const transformBooksWithCopies = (books: ParseBookWithCopies[]) => {
  return books.map((book) => transformBookWithCopies(book));
};
