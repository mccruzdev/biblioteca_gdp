import { ParseCopies, ParseDonation } from 'src/types';
import { transformCopies, transformCopyArray } from './copy';

export const transformDonation = (donation: ParseDonation) => {
  return {
    id: donation.id,
    date: donation.date,
    description: donation.description,
    donor: donation.Donor,
    copies: transformCopyArray(donation.copies),
  };
};

export const transformDonations = (donations: ParseDonation[]) => {
  return donations.map((donation) => transformDonation(donation));
};

export const transformDonationCopiesArray = (copiesArray: ParseCopies[]) => {
  return copiesArray.map((copies) => transformCopies(copies));
};
