import Icon from "./components/icon";
import { NavItem } from "./components/nav-link";

export const navItems: NavItem[] = [
  {
    label: "Catálogo de libros",
    href: "/dashboard",
    icon: (props) => <Icon type="catalog" {...props} />,
  },
  // {
  //   label: "Préstamos",
  //   href: "/dashboard/loan",
  //   icon: (props) => <Icon type="loan" {...props} />,
  //   children: [
  //     { label: "Préstamos", href: "/dashboard/loan" },
  //     { label: "Historial de Préstamos", href: "/dashboard/loan-history" },
  //   ],
  // },
  {
    label: "Libros",
    href: "/dashboard/books",
    icon: (props) => <Icon type="addBook" {...props} />,
    children: [
      { label: "Libros", href: "/dashboard/books" },
      //{ label: "Ejemplares", href: "/dashboard/ejemplares" }, // preguntar a angel, no recuerdo que era xD
    ],
    roles: ["LIBRARIAN", "ADMIN"],
  },
  {
    label: "Usuarios",
    href: "/dashboard/users",
    icon: (props) => <Icon type="user" {...props} />,
  },
  // {
  //   label: "Gestión",
  //   href: "/dashboard/management",
  //   icon: (props) => <Icon type="management" {...props} />,
  // },
  // {
  //   label: "Donaciones",
  //   href: "/dashboard/donations",
  //   icon: (props) => <Icon type="gift" {...props} />,
  // },
];
