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

export interface AllDataUserI extends UserI {
  id: number;
  emailVerified: boolean;
  isDisabled: boolean;
}
