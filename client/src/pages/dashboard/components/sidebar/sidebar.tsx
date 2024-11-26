import { NavLink } from "./components/nav-link";
import { navItems } from "./links";
import "./sidebar.sass";

interface Props {
  isCollapsed: boolean;
}

export function Sidebar({ isCollapsed }: Props) {
  return (
    <aside className={`Sidebar${isCollapsed ? " Sidebar--collapsed" : ""}`}>
      <div className="Sidebar-logo">
        <img
          src={isCollapsed ? "/logo-muni.png" : "/logo-muni2.png"}
          alt="Logo Municipalidad de Guadalupe"
        />
      </div>
      <nav className="Sidebar-nav">
        <ul className="Sidebar-nav-list">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink item={item} isCollapsed={isCollapsed} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
