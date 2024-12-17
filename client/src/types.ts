import { Copy } from "./pages/dashboard/modules/pages/loan/loan.api";

export type UserRoleT = "READER" | "LIBRARIAN" | "ADMIN";

export interface UserI {
  dni: string;
  names: string;
  lastName: string;
  phoneNumber: string;
  role: UserRoleT;
  email: string;
}

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

export interface Reservation {
  id: number;
  created: string;
  dueDate: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  copies: Copy[];
  bookTitle?: string;
  bookId?: number;
}

export interface Loan {
  id: number;
  loanDate: string;
  dueDate: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  copies: Copy[];
  bookTitle?: string;
  bookId?: number;
}

export type Item = BookI | Reservation | Loan;
