import "./not-authorized.sass";
import { Link } from "react-router-dom";

export function NotAuthorized() {
  return (
    <main className="NotAuthorized">
      <h1>No Authorizado</h1>
      <Link to="/">Inicio</Link>
    </main>
  );
}
