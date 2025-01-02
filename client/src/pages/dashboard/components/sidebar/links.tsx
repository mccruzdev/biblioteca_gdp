import Icon from "./components/icon";
import { NavItem } from "./components/nav-link";

export const navItems: NavItem[] = [
  {
    label: "Catálogo de libros",
    href: "/dashboard",
    icon: (props) => <Icon type="catalog" {...props} />,
  },
  {
    label: "Préstamos",
    href: "/dashboard/loan",
    icon: (props) => <Icon type="loan" {...props} />,
    children: [
      { label: "Préstamos", href: "/dashboard/loan" },
      { label: "Historial de Préstamos", href: "/dashboard/loan-history" },
    ],
  },
  {
    label: "Libros",
    href: "/dashboard/books",
    icon: (props) => <Icon type="addBook" {...props} />,
    roles: ["LIBRARIAN", "ADMIN"],
  },
  {
    label: "Donaciones",
    href: "/dashboard/donations",
    icon: (props) => <Icon type="gift" {...props} />,
    children: [
      { label: "Donaciones", href: "/dashboard/donations" },
      { label: "Donadores", href: "/dashboard/donors" },
    ],
    roles: ["LIBRARIAN", "ADMIN"],
  },
  {
    label: "Usuarios",
    href: "/dashboard/users",
    icon: (props) => <Icon type="user" {...props} />,
    roles: ["ADMIN"],
  },
];
