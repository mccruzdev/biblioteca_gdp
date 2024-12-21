import "./not-authorized.sass";
import { Link } from "react-router-dom";

interface Props {
  path?: string;
}

export function NotAuthorized({ path = "/" }: Props) {
  return (
    <main className="NotAuthorized">
      <h1>No Authorizado</h1>
      <Link to={path}>Inicio</Link>
    </main>
  );
}
