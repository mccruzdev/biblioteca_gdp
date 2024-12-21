import "./content.sass";
import { useWindowSize } from "../../../../hooks/size";

interface Props {
  children: React.ReactNode;
  isCollapsed: boolean;
}

export function Content({ children, isCollapsed }: Props) {
  const { width } = useWindowSize();
  return (
    <main
      className={`Content${
        width < 600 || isCollapsed ? " Content--collapsed" : ""
      }`}
    >
      {children}
    </main>
  );
}
