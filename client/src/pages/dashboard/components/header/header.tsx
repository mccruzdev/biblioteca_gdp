import "./header.sass";
import { Bars } from "../../../../components/icons/bars";
import { LogOut, User } from "lucide-react";
import { useAuthUC, useTokenUC } from "../../../../context/user/user.hook";
import { useState } from "react";

interface Props {
  changeIsCollapsed: () => void;
}

export function Header({ changeIsCollapsed }: Props) {
  const { removeItem } = useTokenUC();
  const { user } = useAuthUC();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleClickDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    removeItem();
  };

  return (
    <header className="Header">
      <button
        className="Header-button"
        onClick={changeIsCollapsed}
        aria-label="Open/Close sidebar"
      >
        <Bars />
      </button>
      <div className="Header-content">
        <button className="Header-UserInfo" onClick={handleClickDropdown}>
          <User className="Header-UserInfo-icon" />
          <span>
            {user?.names} {user?.lastName}
          </span>
        </button>
        {isDropdownOpen && (
          <div className="Header-UserInfo-dropdown">
            <button onClick={handleLogout}>
              <LogOut className="Header-UserInfo-dropdown-icon" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
