//import { Copy } from "./pages/dashboard/modules/pages/loan/loan.api";

export type UserRoleT = "READER" | "LIBRARIAN" | "ADMIN";

export enum UserRoleE {
  ADMIN = "ADMIN",
  LIBRARIAN = "LIBRARIAN",
  READER = "READER",
}

export type BookConditionT = "NEW" | "GOOD" | "FAIR" | "DAMAGED" | "BAD";

export enum BookConditionE {
  NEW = "NEW",
  GOOD = "GOOD",
  FAIR = "FAIR",
  DAMAGED = "DAMAGED",
  BAD = "BAD",
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
  copies: CopyI[];
}

export interface LocationI {
  shelf: string;
  shelfColor: string;
  shelfLevel: string;
}

export interface PublisherI {
  name: string;
  email: string;
  country: string;
  address: string;
  phoneNumber: string;
  website: string;
}

export interface CopyI {
  id: number;
  code: string;
  condition: BookConditionT;
  location: LocationI;
  publisher: PublisherI;
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
}

export type Copy = {
  id: number;
  code: string | null;
  condition: BookConditionT;
};

export type ReservationStatusT =
  | "PENDING"
  | "PICKED_UP"
  | "CANCELED"
  | "EXPIRED";

export enum ReservationStatusE {
  PENDING = "PENDING",
  PICKED_UP = "PICKED_UP",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
}

export interface ReservationI {
  id: number;
  created: string;
  dueDate: string;
  status: ReservationStatusT;
  copies: {
    id: number;
    code: string;
    condition: string;
    location: LocationI;
    publisher: PublisherI;
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
}

export enum LoanStatus {
  ACTIVE = "ACTIVE",
  RETURNED = "RETURNED",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

export interface LoanI {
  id: number;
  loanDate: string;
  dueDate: string;
  status: LoanStatus;
  copies: {
    id: number;
    code: string;
    condition: string;
    location: LocationI;
    publisher: PublisherI;
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
}

export interface DonorI {
  id: number;
  name: string;
  email: string | null;
}

export interface DonationsI {
  id: number;
  date: string;
  description: string;
  donor: {
    id: number;
    name: string;
    email: string;
  };
  copies: {
    id: number;
    code: string;
    condition: string;
    location: LocationI;
    publisher: PublisherI;
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
}

export interface AllDataUserI extends UserI {
  id: number;
  emailVerified: boolean;
  isDisabled: boolean;
}
