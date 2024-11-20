import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
}

export const NavLink: React.FC<{ item: NavItem; isCollapsed: boolean }> = ({
  item,
  isCollapsed,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  if (item.children && !isCollapsed) {
    return (
      <div className="nav-item-with-children">
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`nav-item ${isOpen ? "open" : ""}`}
          aria-expanded={isOpen}
        >
          <item.icon hovered={isHovered} className="nav-icon" />
          <span className="nav-label">{item.label}</span>
          {isOpen ? (
            <ChevronUp className="nav-arrow" aria-hidden="true" />
          ) : (
            <ChevronDown className="nav-arrow" aria-hidden="true" />
          )}
        </button>
        {isOpen && (
          <div className="nav-children">
            {item.children.map((child) => (
              <Link key={child.href} to={child.href} className="nav-child-item">
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.href}
      className={`nav-item ${isCollapsed ? "collapsed" : ""}`}
      title={isCollapsed ? item.label : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <item.icon hovered={isHovered} className="nav-icon" />
      {!isCollapsed && <span className="nav-label">{item.label}</span>}
    </Link>
  );
};
