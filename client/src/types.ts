//import { Copy } from "./pages/dashboard/modules/pages/loan/loan.api";

export type UserRoleT = "READER" | "LIBRARIAN" | "ADMIN";

export enum UserRoleE {
  ADMIN = "ADMIN",
  LIBRARIAN = "LIBRARIAN",
  READER = "READER",
}
export interface UserI {
  dni: string;
  names: string;
  lastName: string;
  phoneNumber: string;
  role: UserRoleT;
  email: string;
}

/*export interface PaginatedI<T> {
  total: number;
  lastPage: number;
  currentPage: number;
  limit: number;
  prev: string | null;
  next: string | null;
  data: T[];
}*/

export interface PaginatedI<T> {
  total: number;
  lastPage: number;
  currentPage: number;
  limit: number;
  prev: string | null;
  next: string | null;
  data: T[];
}

export interface AuthorI {
  id: number;
  name: string;
  email: string | null;
}

export interface BookI {
  id: number;
  title: string;
  pages: number;
  authors: AuthorI[];
  subcategory: string | null;
  category: string | null;
}

export type Copy = {
  id: number;
  code: string | null;
  condition: string;
};

export enum ReservationStatus {
  PENDING = 'PENDING',
  PICKED_UP = 'PICKED_UP',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED'
}

export interface Reservation {
  id: number;
  created: string;
  dueDate: string;
  status: ReservationStatus;
  copies: {
    id: number;
    code: string;
    condition: string;
    location: string | null;
    publisher: string | null;
    book: {
      id: number;
      title: string;
      pages: number;
      authors: {
        id: number;
        name: string;
        email: string | null;
      }[];
      subcategory: string | null;
      category: string | null;
    };
  }[];
  bookTitle: string;
  bookId: number;
}

export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export interface Loan {
  id: number;
  loanDate: string;
  dueDate: string;
  status: LoanStatus;
  copies: {
    id: number;
    code: string;
    condition: string;
    location: string | null;
    publisher: string | null;
    book: {
      id: number;
      title: string;
      pages: number;
      authors: {
        id: number;
        name: string;
        email: string | null;
      }[];
      subcategory: string | null;
      category: string | null;
    };
  }[];
  bookTitle: string;
  bookId: number;
}

export interface DonorsI {
  id: number;
  name: string;
  email: string | null;
}

export interface DonationsI{
  id: number;
  date:string;
  description: string;
  donor: {
    id: number;
    name: string;
    email: string;
    };
}

export interface AllDataUserI extends UserI {
  id: number;
  emailVerified: boolean;
  isDisabled: boolean;
}

export type Item = BookI | Reservation | Loan | DonorsI | DonationsI;




