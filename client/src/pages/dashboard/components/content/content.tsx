import "./content.sass";

interface Props {
  children: React.ReactNode;
  isCollapsed: boolean;
}

export function Content({ children, isCollapsed }: Props) {
  return (
    <main className={`Content${isCollapsed ? " Content--collapsed" : ""}`}>
      {children}
    </main>
  );
}
