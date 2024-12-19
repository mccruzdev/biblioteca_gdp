import { ParseReservation } from 'src/types';
import { transformCopyArray } from './copy';

export const transformReservation = (book: ParseReservation) => {
  return {
    id: book.id,
    created: book.created,
    dueDate: book.dueDate,
    status: book.status,
    copies: transformCopyArray(book.copies),
  };
};

export const transformReservations = (books: ParseReservation[]) => {
  return books.map((book) => transformReservation(book));
};
