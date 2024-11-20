import "./header.sass";
import { Bars } from "../../../../components/icons/bars";

interface Props {
  changeIsCollapsed: () => void;
}

export function Header({ changeIsCollapsed }: Props) {
  return (
    <header className="Header">
      <button
        className="Header-button"
        onClick={changeIsCollapsed}
        aria-label="Open/Close sidebar"
      >
        <Bars />
      </button>
      <div className="Header-content">heloo</div>
    </header>
  );
}
