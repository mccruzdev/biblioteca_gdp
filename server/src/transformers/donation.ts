import { ParseCopies, ParseDonation } from 'src/types';
import { transformCopies } from './copy';

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

export const transformDonationCopiesArray = (copiesArray: ParseCopies[]) => {
  return copiesArray.map((copies) => transformCopies(copies));
};
