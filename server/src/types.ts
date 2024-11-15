export type RolesT = 'ADMIN' | 'LIBRARIAN' | 'READER';

export enum RolesE {
  ADMIN = 'ADMIN',
  LIBRARIAN = 'LIBRARIAN',
  READER = 'READER',
}

export type BookConditionT = 'GOOD' | 'BAD';

export enum BookConditionE {
  GOOD = 'GOOD',
  BAD = 'BAD',
}

export type BookStatusT = 'AVAILABLE' | 'RESERVED';

export enum BookStatusE {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
}

export type DonationDirectionT = 'YES' | 'NO';

export enum DonationDirectionE {
  YES = 'YES',
  NO = 'NO',
}

export type ReservationStatus = 'PENDING' | 'PICKED_UP' | 'CANCELED';

export enum ReservationStatusE {
  PENDING = 'PENDING',
  PICKED_UP = 'PICKED_UP',
  CANCELED = 'CANCELED',
}
