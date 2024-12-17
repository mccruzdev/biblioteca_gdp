import { ParseCopies, ParseCopy, ParseDonation } from 'src/types';
import { transformBook } from './book';

export const transformDonation = (donation: ParseDonation) => {
  return {
    id: donation.id,
    date: donation.date,
    description: donation.description,
    donor: donation.Donor,
  };
};

export const transformDonations = (donations: ParseDonation[]) => {
  return donations.map((donation) => transformDonation(donation));
};

export const transformDonationCopy = (copy: ParseCopy) => {
  return {
    id: copy.id,
    code: copy.code,
    condition: copy.condition,
    location: copy.Location,
    publisher: copy.Publisher,
    book: transformBook(copy.Book),
  };
};

export const transformDonationCopies = (copies: ParseCopies) => {
  return copies.copies.map((copy) => transformDonationCopy(copy));
};

export const transformDonationCopiesArray = (copiesArray: ParseCopies[]) => {
  return copiesArray.map((copies) => transformDonationCopies(copies));
};
