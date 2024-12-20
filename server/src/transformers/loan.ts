import { ParseLoan } from 'src/types';
import { transformCopyArray } from './copy';

export const transformLoan = (book: ParseLoan) => {
  return {
    id: book.id,
    loanDate: book.loanDate,
    dueDate: book.dueDate,
    status: book.status,
    copies: transformCopyArray(book.copies),
  };
};

export const transformLoans = (books: ParseLoan[]) => {
  return books.map((book) => transformLoan(book));
};
