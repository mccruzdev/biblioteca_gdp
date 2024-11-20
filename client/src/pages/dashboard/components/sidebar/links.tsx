import Icon from "./components/icon";
import { NavItem } from "./components/nav-link";

export const navItems: NavItem[] = [
  {
    label: "Catálogo de libros",
    href: "/_dashboard",
    icon: (props) => <Icon type="catalog" {...props} />,
  },
  {
    label: "Préstamos",
    href: "/_dashboard/loan",
    icon: (props) => <Icon type="loan" {...props} />,
    children: [
      { label: "Préstamos", href: "/_dashboard/loan" },
      { label: "Historial de Préstamos", href: "/_dashboard/loan-history" },
    ],
  },
  {
    label: "Agregar Libros",
    href: "/_dashboard/add-books",
    icon: (props) => <Icon type="addBook" {...props} />,
  },
  {
    label: "Usuarios",
    href: "/_dashboard/users",
    icon: (props) => <Icon type="user" {...props} />,
  },
  {
    label: "Gestión",
    href: "/_dashboard/management",
    icon: (props) => <Icon type="management" {...props} />,
  },
  {
    label: "Donaciones",
    href: "/_dashboard/donations",
    icon: (props) => <Icon type="gift" {...props} />,
  },
];
