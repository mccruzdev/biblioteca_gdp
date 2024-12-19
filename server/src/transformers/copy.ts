import { ParseCopies, ParseCopy } from 'src/types';
import { transformBook } from './book';

export const transformCopy = (copy: ParseCopy) => {
  return {
    id: copy.id,
    code: copy.code,
    condition: copy.condition,
    location: copy.Location,
    publisher: copy.Publisher,
    book: transformBook(copy.Book),
  };
};

export const transformCopyArray = (copy: ParseCopy[]) => {
  return copy.map((copy) => transformCopy(copy));
};

export const transformCopies = (copies: ParseCopies) => {
  return copies.copies.map((copy) => transformCopy(copy));
};
