export interface TokenData {
  id: number;
  role: RolesT;
}

export type RolesT = 'ADMIN' | 'LIBRARIAN' | 'READER';

export enum RolesE {
  ADMIN = 'ADMIN',
  LIBRARIAN = 'LIBRARIAN',
  READER = 'READER',
}

export type BookConditionT = 'NEW' | 'GOOD' | 'FAIR' | 'DAMAGED' | 'BAD';

export enum BookConditionE {
  NEW = 'NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  DAMAGED = 'DAMAGED',
  BAD = 'BAD',
}

export type LoanStatusT = 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'CANCELLED';

export enum LoanStatusE {
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export type ReservationStatus =
  | 'PENDING'
  | 'PICKED_UP'
  | 'CANCELED'
  | 'EXPIRED';

export enum ReservationStatusE {
  PENDING = 'PENDING',
  PICKED_UP = 'PICKED_UP',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
}

export interface Author {
  id: number;
  name: string;
  email?: string | null;
}

export interface ParseBook {
  id: number;
  title: string;
  pages?: number;
  authors?: Author[];
  Subcategory?: any | null;
}
